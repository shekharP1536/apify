"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ModeToggle } from "@/components/ui/theme-switcher";
import { DataModal } from "@/components/ui/data-modal";

interface ActorSchema {
  title?: string;
  type: string;
  properties?: Record<string, any>;
  required?: string[];
}

interface ActorDetails {
  id: string;
  name: string;
  title: string;
  description: string;
  username: string;
  isPublic?: boolean;
  categories?: string[];
  exampleRunInput?: {
    body?: string;
    contentType?: string;
  };
  defaultRunOptions?: {
    build?: string;
    timeoutSecs?: number;
    memoryMbytes?: number;
  };
  stats?: {
    totalRuns?: number;
    totalUsers?: number;
    totalUsers7Days?: number;
    totalUsers30Days?: number;
    totalUsers90Days?: number;
    lastRunStartedAt?: string;
    publicActorRunStats30Days?: {
      SUCCEEDED?: number;
      FAILED?: number;
      ABORTED?: number;
      "TIMED-OUT"?: number;
      TOTAL?: number;
    };
  };
  createdAt?: string;
  modifiedAt?: string;
  pictureUrl?: string;
}

interface RunResult {
  id: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  datasetId?: string;
  defaultDatasetId?: string;
  defaultKeyValueStoreId?: string;
  defaultRequestQueueId?: string;
  statusMessage?: string;
  isStatusMessageTerminal?: boolean;
  buildNumber?: string;
  exitCode?: number;
  containerUrl?: string;
  consoleUrl?: string;
  usageTotalUsd?: number;
  stats?: {
    inputBodyLen?: number;
    durationMillis?: number;
    runTimeSecs?: number;
    computeUnits?: number;
    memAvgBytes?: number;
    memMaxBytes?: number;
    cpuAvgUsage?: number;
    cpuMaxUsage?: number;
    netRxBytes?: number;
    netTxBytes?: number;
    restartCount?: number;
    resurrectCount?: number;
    rebootCount?: number;
  };
  options?: {
    build?: string;
    timeoutSecs?: number;
    memoryMbytes?: number;
    maxTotalChargeUsd?: number;
    diskMbytes?: number;
  };
  chargedEventCounts?: Record<string, number>;
  accountedChargedEventCounts?: Record<string, number>;
  pricingInfo?: {
    pricingModel?: string;
    reasonForChange?: string;
    minimalMaxTotalChargeUsd?: number;
    pricingPerEvent?: {
      actorChargeEvents?: Record<
        string,
        {
          eventTitle: string;
          eventDescription: string;
          eventPriceUsd: number;
        }
      >;
    };
  };
}

export default function ActorPage() {
  const params = useParams();
  const router = useRouter();
  const actorId = params.id as string;

  const [apiKey, setApiKey] = useState("");
  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [inputSchema, setInputSchema] = useState<ActorSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [inputData, setInputData] = useState<Record<string, any>>({});
  const [datasetResults, setDatasetResults] = useState<any[]>([]);
  const [fetchingResults, setFetchingResults] = useState(false);
  const [editableInput, setEditableInput] = useState<string>("");
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  useEffect(() => {
    // Get API key from localStorage
    const storedApiKey = localStorage.getItem("apify-api-key");
    if (!storedApiKey) {
      toast.error("API key not found. Please go back and enter your API key.");
      router.push("/");
      return;
    }
    setApiKey(storedApiKey);
    fetchActorSchema(storedApiKey);
  }, [actorId, router]);

  const fetchActorSchema = async (key: string) => {
    try {
      // Create a placeholder actor object with the actorId
      setActor({
        id: actorId,
        name: actorId.split("/")[1] || actorId,
        title: actorId,
        description: "Loading actor details...",
        username: actorId.split("/")[0] || "unknown",
      });

      // Fetch actor details
      const actorResponse = await fetch(`/api/schema?actorId=${actorId}`, {
        headers: {
          "x-apify-api-key": key,
        },
      });

      if (actorResponse.ok) {
        const response = await actorResponse.json();
        const actorData = response.data;

        // Debug: Log the full actor data to see what we're getting
        console.log("Full actor data received:", actorData);

        // Update actor details with the fetched data
        if (actorData) {
          setActor({
            id: actorData.id,
            name: actorData.name,
            title: actorData.title || actorData.name,
            description: actorData.description || "No description available",
            username: actorData.username,
            isPublic: actorData.isPublic,
            categories: actorData.categories,
            stats: actorData.stats,
            exampleRunInput: actorData.exampleRunInput,
            defaultRunOptions: actorData.defaultRunOptions,
            createdAt: actorData.createdAt,
            modifiedAt: actorData.modifiedAt,
            pictureUrl: actorData.pictureUrl,
          });

          // Set the editable input with example input if available
          if (actorData.exampleRunInput?.body) {
            setEditableInput(actorData.exampleRunInput.body);
          } else {
            setEditableInput("{}"); // Default empty JSON object
          }
        }
      } else {
        console.error("Failed to fetch actor details");
        toast.error("Failed to load actor details");
      }

      // Note: We no longer fetch input schema separately since we're using editable input
    } catch (error) {
      console.error("Error fetching actor data:", error);
      toast.error("Failed to load actor data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const runActor = async () => {
    if (!apiKey || !actor) return;

    setRunning(true);
    try {
      // Parse the editable input
      let parsedInput = {};
      try {
        parsedInput = JSON.parse(editableInput);
      } catch (error) {
        toast.error("Invalid JSON in input. Please check your input format.");
        setRunning(false);
        return;
      }

      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apify-api-key": apiKey,
        },
        body: JSON.stringify({
          actorId: actor.id,
          input: parsedInput,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setRunResult(result.data);
        toast.success("Actor started successfully!");

        // Poll for run status
        pollRunStatus(result.data.id);
      } else {
        throw new Error("Failed to start actor run");
      }
    } catch (error) {
      console.error("Error running actor:", error);
      toast.error("Failed to start actor. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  const pollRunStatus = async (runId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/run?runId=${runId}`, {
          headers: {
            "x-apify-api-key": apiKey,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setRunResult(result.data);

          if (result.data.status === "SUCCEEDED") {
            toast.success("Actor run completed successfully!");
            // Fetch dataset results if available
            if (result.data.datasetId) {
              fetchDatasetResults(result.data.datasetId);
            }
            return;
          } else if (result.data.status === "FAILED") {
            const errorMessage = result.data.statusMessage
              ? `Actor run failed: ${result.data.statusMessage}`
              : "Actor run failed!";
            toast.error(errorMessage);
            return;
          } else if (result.data.status === "ABORTED") {
            toast.error("Actor run was aborted!");
            return;
          } else if (result.data.status === "TIMED-OUT") {
            toast.error("Actor run timed out!");
            return;
          } else if (result.data.status === "RUNNING") {
            // Continue polling
            setTimeout(checkStatus, 3000);
          }
        } else {
          console.error("Failed to fetch run status");
          toast.error("Failed to check run status. Please refresh the page.");
        }
      } catch (error) {
        console.error("Error checking run status:", error);
        toast.error("Connection error while checking run status.");
      }
    };

    setTimeout(checkStatus, 3000);
  };

  const fetchDatasetResults = async (datasetId: string) => {
    setFetchingResults(true);
    try {
      const response = await fetch(`/api/dataset?datasetId=${datasetId}`, {
        headers: {
          "x-apify-api-key": apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDatasetResults(data.slice(0, 50)); // Show first 50 results for better table view
        setIsDataModalOpen(true); // Open the modal when data is loaded
        toast.success("Results loaded successfully!");
      } else {
        throw new Error("Failed to fetch results");
      }
    } catch (error) {
      console.error("Error fetching dataset results:", error);
      toast.error("Failed to load results.");
    } finally {
      setFetchingResults(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setInputData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const renderInputField = (fieldName: string, fieldSchema: any) => {
    const { type, title, description, default: defaultValue } = fieldSchema;

    switch (type) {
      case "string":
        return (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium mb-2"
            >
              {title || fieldName}
              {inputSchema?.required?.includes(fieldName) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {description && (
              <p className="text-xs text-gray-500 mb-2">{description}</p>
            )}
            <Input
              id={fieldName}
              type="text"
              value={inputData[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder={defaultValue || `Enter ${title || fieldName}`}
            />
          </div>
        );

      case "number":
      case "integer":
        return (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium mb-2"
            >
              {title || fieldName}
              {inputSchema?.required?.includes(fieldName) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {description && (
              <p className="text-xs text-gray-500 mb-2">{description}</p>
            )}
            <Input
              id={fieldName}
              type="number"
              value={inputData[fieldName] || ""}
              onChange={(e) =>
                handleInputChange(fieldName, parseFloat(e.target.value) || 0)
              }
              placeholder={
                defaultValue?.toString() || `Enter ${title || fieldName}`
              }
            />
          </div>
        );

      case "boolean":
        return (
          <div key={fieldName} className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={inputData[fieldName] || false}
                onChange={(e) => handleInputChange(fieldName, e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">
                {title || fieldName}
                {inputSchema?.required?.includes(fieldName) && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
            </label>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium mb-2"
            >
              {title || fieldName}
              {inputSchema?.required?.includes(fieldName) && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            {description && (
              <p className="text-xs text-gray-500 mb-2">{description}</p>
            )}
            <textarea
              id={fieldName}
              value={JSON.stringify(inputData[fieldName] || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleInputChange(fieldName, parsed);
                } catch {
                  // Invalid JSON, keep as string for now
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md min-h-[100px] font-mono text-sm"
              placeholder={`Enter ${title || fieldName} (JSON format)`}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="font-sans min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading actor details and input schema...</p>
          <p className="text-sm text-gray-500 mt-2">Actor ID: {actorId}</p>
        </div>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="font-sans min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load actor details</p>
          <p className="text-sm text-gray-500 mb-4">
            Could not fetch information for actor: {actorId}
          </p>
          <Button onClick={() => router.push("/")}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with navigation, title, theme switcher and run button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push("/")} variant="outline">
              ← Back to Actors
            </Button>
            <h1 className="text-3xl font-bold">
              {actor.username}/{actor.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Button
              onClick={runActor}
              size="lg"
              disabled={running}
              className="min-w-[140px]"
            >
              {running ? "Starting..." : "Run Actor"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Actor Info & Input Form */}
          <div className="space-y-6">
            <div className="border border-border/50 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                {actor.pictureUrl && (
                  <img
                    src={actor.pictureUrl}
                    alt={actor.title}
                    className="w-16 h-16 rounded-lg object-cover border border-border/50"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{actor.title}</h2>
                  <p className="text-muted-foreground mb-4">
                    {actor.description}
                  </p>
                </div>
              </div>

              {/* Categories */}
              {actor.categories && actor.categories.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {actor.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Author:
                  </span>
                  <p className="text-foreground">{actor.username}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Visibility:
                  </span>
                  <p className="text-foreground">
                    {actor.isPublic ? "Public" : "Private"}
                  </p>
                </div>
                {actor.createdAt && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Created:
                    </span>
                    <p className="text-foreground">
                      {new Date(actor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {actor.modifiedAt && (
                  <div>
                    <span className="font-medium text-muted-foreground">
                      Last Updated:
                    </span>
                    <p className="text-foreground">
                      {new Date(actor.modifiedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Actor Stats */}
              {actor.stats && (
                <div className="mt-4 p-4 border border-border/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">
                    Usage Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {actor.stats.totalRuns && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Total Runs:
                        </span>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          {actor.stats.totalRuns.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {actor.stats.totalUsers && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Total Users:
                        </span>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {actor.stats.totalUsers.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {actor.stats.totalUsers30Days && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Users (30 days):
                        </span>
                        <p className="text-foreground">
                          {actor.stats.totalUsers30Days.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {actor.stats.lastRunStartedAt && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Last Run:
                        </span>
                        <p className="text-foreground">
                          {new Date(
                            actor.stats.lastRunStartedAt
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Success Rate */}
                  {actor.stats.publicActorRunStats30Days && (
                    <div className="mt-3 p-3 border border-border/30 rounded">
                      <h5 className="font-medium text-foreground mb-2">
                        30-Day Success Rate
                      </h5>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>
                            Success:{" "}
                            {(
                              actor.stats.publicActorRunStats30Days.SUCCEEDED ||
                              0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span>
                            Failed:{" "}
                            {(
                              actor.stats.publicActorRunStats30Days.FAILED || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span>
                            Timeout:{" "}
                            {(
                              actor.stats.publicActorRunStats30Days[
                                "TIMED-OUT"
                              ] || 0
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Default Run Options */}
              {actor.defaultRunOptions && (
                <div className="mt-4 p-4 border border-border/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">
                    Default Configuration
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {actor.defaultRunOptions.memoryMbytes && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Memory:
                        </span>
                        <p className="text-foreground">
                          {actor.defaultRunOptions.memoryMbytes} MB
                        </p>
                      </div>
                    )}
                    {actor.defaultRunOptions.timeoutSecs && (
                      <div>
                        <span className="font-medium text-muted-foreground">
                          Timeout:
                        </span>
                        <p className="text-foreground">
                          {Math.round(actor.defaultRunOptions.timeoutSecs / 60)}{" "}
                          minutes
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-muted-foreground">
                <p>Actor ID: {actor.id}</p>
              </div>
            </div>

            <div className="border border-border/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                Input Configuration
              </h3>

              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-2">
                  Actor Input (JSON)
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Edit the JSON input below. Use the "Run Actor" button at the
                  top to execute with your custom parameters.
                </p>

                <textarea
                  value={editableInput}
                  onChange={(e) => setEditableInput(e.target.value)}
                  className="w-full p-3 border border-border rounded-md min-h-[200px] font-mono text-sm focus:ring-2 focus:ring-primary focus:border-primary bg-background"
                  placeholder="Enter JSON input for the actor..."
                />

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const formatted = JSON.stringify(
                          JSON.parse(editableInput),
                          null,
                          2
                        );
                        setEditableInput(formatted);
                        toast.success("JSON formatted!");
                      } catch (error) {
                        toast.error("Invalid JSON - cannot format");
                      }
                    }}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded hover:bg-secondary/80 border border-border"
                  >
                    Format JSON
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (actor?.exampleRunInput?.body) {
                        setEditableInput(actor.exampleRunInput.body);
                        toast.success("Reset to example input!");
                      } else {
                        setEditableInput("{}");
                        toast.success("Reset to empty object!");
                      }
                    }}
                    className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 border border-border"
                  >
                    Reset to Example
                  </button>
                </div>
              </div>

              {/* Show example input for reference if available */}
              {actor?.exampleRunInput && (
                <div className="mb-6 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <h4 className="font-semibold text-primary mb-2">
                    Example Input Reference
                  </h4>
                  <div className="text-sm text-primary/80 mb-2">
                    Content-Type: {actor.exampleRunInput.contentType}
                  </div>
                  <pre className="text-xs bg-background p-3 rounded border border-border overflow-x-auto max-h-32">
                    {actor.exampleRunInput.body}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Run Results */}
          <div className="space-y-6">
            {runResult && (
              <div className="border border-border/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Run Status</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        runResult.status === "SUCCEEDED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : runResult.status === "FAILED" ||
                            runResult.status === "ABORTED" ||
                            runResult.status === "TIMED-OUT"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : runResult.status === "RUNNING"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {runResult.status}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Run ID:</span>
                    <span className="text-sm font-mono text-muted-foreground">
                      {runResult.id}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Started:</span>
                    <span className="text-sm">
                      {new Date(runResult.startedAt).toLocaleString()}
                    </span>
                  </div>

                  {runResult.finishedAt && (
                    <div className="flex justify-between">
                      <span className="font-medium">Finished:</span>
                      <span className="text-sm">
                        {new Date(runResult.finishedAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Duration */}
                  {runResult.stats?.durationMillis && (
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span className="text-sm">
                        {(runResult.stats.durationMillis / 1000).toFixed(2)}s
                      </span>
                    </div>
                  )}

                  {/* Exit Code */}
                  {runResult.exitCode !== undefined && (
                    <div className="flex justify-between">
                      <span className="font-medium">Exit Code:</span>
                      <span
                        className={`text-sm ${
                          runResult.exitCode === 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {runResult.exitCode}
                      </span>
                    </div>
                  )}

                  {/* Build Number */}
                  {runResult.buildNumber && (
                    <div className="flex justify-between">
                      <span className="font-medium">Build:</span>
                      <span className="text-sm font-mono text-muted-foreground">
                        {runResult.buildNumber}
                      </span>
                    </div>
                  )}

                  {/* Status Message */}
                  {runResult.statusMessage && (
                    <div
                      className={`mt-3 p-3 rounded ${
                        runResult.status === "FAILED" ||
                        runResult.status === "ABORTED" ||
                        runResult.status === "TIMED-OUT"
                          ? "border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                          : "border border-primary/20 bg-primary/5"
                      }`}
                    >
                      <span
                        className={`font-medium ${
                          runResult.status === "FAILED" ||
                          runResult.status === "ABORTED" ||
                          runResult.status === "TIMED-OUT"
                            ? "text-red-800 dark:text-red-400"
                            : "text-primary"
                        }`}
                      >
                        Status Message:
                      </span>
                      <p
                        className={`text-sm mt-1 ${
                          runResult.status === "FAILED" ||
                          runResult.status === "ABORTED" ||
                          runResult.status === "TIMED-OUT"
                            ? "text-red-700 dark:text-red-300"
                            : "text-primary/80"
                        }`}
                      >
                        {runResult.statusMessage}
                      </p>
                    </div>
                  )}

                  {/* Error Details for Failed Runs */}
                  {(runResult.status === "FAILED" ||
                    runResult.status === "ABORTED" ||
                    runResult.status === "TIMED-OUT") && (
                    <div className="mt-4 p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <h4 className="font-semibold text-red-800 dark:text-red-400 mb-3">
                        Run Failed
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium text-red-700 dark:text-red-300">
                            Status:
                          </span>
                          <span className="text-red-800 dark:text-red-400">
                            {runResult.status}
                          </span>
                        </div>
                        {runResult.exitCode !== undefined &&
                          runResult.exitCode !== 0 && (
                            <div className="flex justify-between">
                              <span className="font-medium text-red-700 dark:text-red-300">
                                Exit Code:
                              </span>
                              <span className="text-red-800 dark:text-red-400">
                                {runResult.exitCode}
                              </span>
                            </div>
                          )}
                        {runResult.statusMessage && (
                          <div className="mt-2">
                            <span className="font-medium text-red-700 dark:text-red-300">
                              Error Message:
                            </span>
                            <p className="text-red-800 dark:text-red-400 mt-1 whitespace-pre-wrap">
                              {runResult.statusMessage}
                            </p>
                          </div>
                        )}
                        {runResult.stats?.durationMillis && (
                          <div className="flex justify-between">
                            <span className="font-medium text-red-700 dark:text-red-300">
                              Runtime:
                            </span>
                            <span className="text-red-800 dark:text-red-400">
                              {(runResult.stats.durationMillis / 1000).toFixed(
                                2
                              )}
                              s
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Resource Usage (if completed) */}
                  {runResult.status === "SUCCEEDED" && runResult.stats && (
                    <div className="mt-4 p-4 border border-border/30 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">
                        Resource Usage
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {runResult.stats.computeUnits && (
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Compute Units:
                            </span>
                            <p className="text-foreground">
                              {runResult.stats.computeUnits.toFixed(4)}
                            </p>
                          </div>
                        )}
                        {runResult.stats.memMaxBytes && (
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Peak Memory:
                            </span>
                            <p className="text-foreground">
                              {(
                                runResult.stats.memMaxBytes /
                                1024 /
                                1024
                              ).toFixed(1)}{" "}
                              MB
                            </p>
                          </div>
                        )}
                        {runResult.stats.cpuMaxUsage && (
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Peak CPU:
                            </span>
                            <p className="text-foreground">
                              {runResult.stats.cpuMaxUsage.toFixed(1)}%
                            </p>
                          </div>
                        )}
                        {runResult.stats.netRxBytes && (
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Network In:
                            </span>
                            <p className="text-foreground">
                              {(runResult.stats.netRxBytes / 1024).toFixed(1)}{" "}
                              KB
                            </p>
                          </div>
                        )}
                        {runResult.stats.netTxBytes && (
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Network Out:
                            </span>
                            <p className="text-foreground">
                              {(runResult.stats.netTxBytes / 1024).toFixed(1)}{" "}
                              KB
                            </p>
                          </div>
                        )}
                        {runResult.usageTotalUsd && (
                          <div>
                            <span className="font-medium text-muted-foreground">
                              Total Cost:
                            </span>
                            <p className="text-foreground font-semibold">
                              ${runResult.usageTotalUsd.toFixed(3)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Charged Events (if available) */}
                  {runResult.chargedEventCounts &&
                    Object.keys(runResult.chargedEventCounts).length > 0 && (
                      <div className="mt-4 p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <h4 className="font-semibold text-green-800 dark:text-green-400 mb-3">
                          Charged Events
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(runResult.chargedEventCounts).map(
                            ([event, count]) =>
                              count > 0 && (
                                <div
                                  key={event}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-green-700 dark:text-green-300 capitalize">
                                    {event.replace("-", " ")}:
                                  </span>
                                  <span className="font-semibold text-green-800 dark:text-green-400">
                                    {count.toLocaleString()}
                                  </span>
                                </div>
                              )
                          )}
                        </div>

                        {/* Pricing breakdown if available */}
                        {runResult.pricingInfo?.pricingPerEvent
                          ?.actorChargeEvents && (
                          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                            <p className="text-xs text-green-600 dark:text-green-400 mb-2">
                              Pricing per event:
                            </p>
                            {Object.entries(runResult.chargedEventCounts).map(
                              ([event, count]) => {
                                const eventInfo =
                                  runResult.pricingInfo?.pricingPerEvent
                                    ?.actorChargeEvents?.[event];
                                if (count > 0 && eventInfo) {
                                  return (
                                    <div
                                      key={event}
                                      className="text-xs text-green-600 dark:text-green-400 flex justify-between"
                                    >
                                      <span>
                                        {eventInfo.eventTitle}: $
                                        {eventInfo.eventPriceUsd} × {count}
                                      </span>
                                      <span>
                                        $
                                        {(
                                          eventInfo.eventPriceUsd * count
                                        ).toFixed(3)}
                                      </span>
                                    </div>
                                  );
                                }
                                return null;
                              }
                            )}
                          </div>
                        )}
                      </div>
                    )}

                  {/* Action Buttons */}
                  <div className="mt-4 space-y-2">
                    {/* Retry button for failed runs */}
                    {(runResult.status === "FAILED" ||
                      runResult.status === "ABORTED" ||
                      runResult.status === "TIMED-OUT") && (
                      <Button
                        onClick={runActor}
                        className="w-full"
                        disabled={running}
                        variant="default"
                      >
                        {running ? "Retrying..." : "Retry Run"}
                      </Button>
                    )}

                    {runResult.consoleUrl && (
                      <Button
                        onClick={() =>
                          window.open(runResult.consoleUrl, "_blank")
                        }
                        className="w-full"
                        variant="outline"
                      >
                        View Run in Apify Console
                      </Button>
                    )}

                    {(runResult.datasetId || runResult.defaultDatasetId) &&
                      runResult.status === "SUCCEEDED" && (
                        <>
                          <Button
                            onClick={() => {
                              const datasetId =
                                runResult.datasetId ||
                                runResult.defaultDatasetId!;
                              if (datasetResults.length > 0) {
                                setIsDataModalOpen(true);
                              } else {
                                fetchDatasetResults(datasetId);
                              }
                            }}
                            className="w-full"
                            variant="outline"
                            disabled={fetchingResults}
                          >
                            {fetchingResults
                              ? "Loading Results..."
                              : datasetResults.length > 0
                              ? `View Results (${datasetResults.length})`
                              : "Load Dataset Results"}
                          </Button>
                          <Button
                            onClick={() =>
                              window.open(
                                `https://console.apify.com/storage/datasets/${
                                  runResult.datasetId ||
                                  runResult.defaultDatasetId
                                }`,
                                "_blank"
                              )
                            }
                            className="w-full"
                            variant="outline"
                          >
                            View Dataset in Console
                          </Button>
                        </>
                      )}

                    {runResult.defaultKeyValueStoreId &&
                      runResult.status === "SUCCEEDED" && (
                        <Button
                          onClick={() =>
                            window.open(
                              `https://console.apify.com/storage/key-value-stores/${runResult.defaultKeyValueStoreId}`,
                              "_blank"
                            )
                          }
                          className="w-full"
                          variant="outline"
                        >
                          View Key-Value Store
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            )}

            {datasetResults.length > 0 && (
              <div className="border border-border/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Results Available</h3>
                  <Button
                    onClick={() => setIsDataModalOpen(true)}
                    variant="outline"
                  >
                    View Results ({datasetResults.length})
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dataset results are ready to view. Click "View Results" to see
                  them in a structured table format.
                </p>
                {datasetResults.length === 50 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Showing first 50 results. View all in Apify Console.
                  </p>
                )}
              </div>
            )}

            <div className="border border-border/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Actor Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This actor will process your input and return results. The
                execution time varies depending on the complexity of the task.
              </p>

              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Actor ID:</span>
                    <p className="font-mono">{actor.id}</p>
                  </div>
                  <div>
                    <span className="font-medium">Public:</span>
                    <p>{actor.isPublic ? "Yes" : "No"}</p>
                  </div>
                </div>

                {actor.categories && actor.categories.length > 0 && (
                  <div>
                    <span className="font-medium">Categories:</span>
                    <p>{actor.categories.join(", ")}</p>
                  </div>
                )}

                {actor.stats && (
                  <div className="pt-2 border-t border-border/30">
                    <div className="grid grid-cols-2 gap-4">
                      {actor.stats.totalRuns && (
                        <div>
                          <span className="font-medium">Total Runs:</span>
                          <p>{actor.stats.totalRuns.toLocaleString()}</p>
                        </div>
                      )}
                      {actor.stats.totalUsers && (
                        <div>
                          <span className="font-medium">Total Users:</span>
                          <p>{actor.stats.totalUsers.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {actor.defaultRunOptions && (
                  <div className="pt-2 border-t border-border/30">
                    <span className="font-medium">Default Settings:</span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {actor.defaultRunOptions.memoryMbytes && (
                        <p>Memory: {actor.defaultRunOptions.memoryMbytes} MB</p>
                      )}
                      {actor.defaultRunOptions.timeoutSecs && (
                        <p>
                          Timeout:{" "}
                          {Math.round(actor.defaultRunOptions.timeoutSecs / 60)}{" "}
                          min
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border/30 flex gap-4">
                  <Button
                    onClick={() =>
                      window.open(
                        `https://console.apify.com/actors/${actor.id}`,
                        "_blank"
                      )
                    }
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    View in Console
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        `https://apify.com/${actor.username}/${actor.name}`,
                        "_blank"
                      )
                    }
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Actor Store Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Modal */}
        <DataModal
          isOpen={isDataModalOpen}
          onClose={() => setIsDataModalOpen(false)}
          data={datasetResults}
          title="Dataset Results"
        />
      </div>
    </div>
  );
}
