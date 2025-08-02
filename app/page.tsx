"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ui/theme-switcher";

interface Actor {
  id: string;
  name: string;
  title: string;
  description: string;
  username: string;
}

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [isValidated, setIsValidated] = useState(false);
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedActor, setSelectedActor] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  // Check for stored API key on component mount
  useEffect(() => {
    const checkStoredApiKey = async () => {
      const storedApiKey = localStorage.getItem("apify-api-key");
      if (storedApiKey && storedApiKey.length >= 32) {
        setApiKey(storedApiKey);
        setLoading(true);
        try {
          const response = await fetch("/api/actors", {
            headers: {
              "x-apify-api-key": storedApiKey,
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Stored API Key is valid. Actors fetched:", data);
            setActors(data.data.items || []);
            setIsValidated(true);
            toast.success("Welcome back! Your API key is still valid.");
          } else {
            // API key is invalid, remove it
            localStorage.removeItem("apify-api-key");
            setApiKey("");
            toast.error(
              "Stored API key is no longer valid. Please enter a new one."
            );
          }
        } catch (error) {
          console.error("Error validating stored API Key:", error);
          localStorage.removeItem("apify-api-key");
          setApiKey("");
          toast.error(
            "Error validating stored API key. Please enter a new one."
          );
        } finally {
          setLoading(false);
        }
      }
      setInitialLoading(false);
    };

    checkStoredApiKey();
  }, []);

  const Checkapi = async () => {
    console.log("API Key:", apiKey);

    // If already validated and same API key, don't make another call
    if (isValidated && localStorage.getItem("apify-api-key") === apiKey) {
      toast.info("API key is already validated!");
      return;
    }

    if (apiKey && apiKey.length >= 32) {
      setLoading(true);
      try {
        const response = await fetch("/api/actors", {
          headers: {
            "x-apify-api-key": apiKey,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Key is valid. Actors fetched:", data);
          toast.success("API Key is valid. Loading actors...");
          setActors(data.data.items || []);
          console.log("Actors:", data.data);
          setIsValidated(true);

          // Store API key in localStorage for use in other pages
          localStorage.setItem("apify-api-key", apiKey);
        } else {
          throw new Error("Invalid API key");
        }
      } catch (error) {
        console.error("Invalid API Key:", error);
        toast.error("Invalid API key. Please check and try again.");
        setApiKey("");
        // Clear any stored invalid key
        localStorage.removeItem("apify-api-key");
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Invalid API Key. Please enter a valid key.");
      toast.error("Please enter a valid API key.");
      setApiKey("");
    }
  };

  const handleActorSelect = () => {
    if (selectedActor) {
      router.push(`/actor/${selectedActor}`);
    } else {
      toast.error("Please select an actor first.");
    }
  };

  // Show loading spinner while checking for stored API key
  if (initialLoading) {
    return (
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Checking for saved API key...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl w-full">
        {!isValidated ? (
          <>
            <h1 className="text-4xl font-bold">
              Enter your API keys for Apify
            </h1>
            <Input
              placeholder="Enter your API key here"
              className="w-full max-w-md"
              minLength={32}
              onChange={(e) => setApiKey(e.target.value)}
              type="text"
              value={apiKey}
              required
              autoFocus
              aria-label="API key input"
              aria-describedby="api-key-input"
              id="api-key-input"
              name="api-key-input"
            />
            <Button
              onClick={Checkapi}
              id="api-key-button"
              className="w-full max-w-md cursor-pointer"
              disabled={loading}
            >
              {loading ? "Validating..." : "Get started"}
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between w-full">
              <h1 className="text-4xl font-bold tracking-tight">
                Select an Actor
              </h1>
              <Button
                onClick={() => {
                  setIsValidated(false);
                  setApiKey("");
                  setActors([]);
                  setSelectedActor("");
                  localStorage.removeItem("apify-api-key");
                  toast.info("API key cleared. Please enter a new one.");
                }}
                variant="outline"
              >
                Change API Key
              </Button>
              <ModeToggle />
            </div>

            <div className="w-full">
              {actors.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No actors found. Please check your API key.
                </p>
              ) : (
                <>
                  <label
                    htmlFor="actor-select"
                    className="block text-sm font-medium mb-2"
                  >
                    Choose an actor to run:
                  </label>
                  <select
                    id="actor-select"
                    value={selectedActor}
                    onChange={(e) => setSelectedActor(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select an actor...</option>
                    {actors?.map((actor) => (
                      <option key={actor.id} value={actor.id}>
                        {actor.username}/{actor.name} - {actor.title}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <Button
              onClick={handleActorSelect}
              className="w-full max-w-md cursor-pointer"
              disabled={!selectedActor}
            >
              Configure & Run Actor
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-8">
              {actors.slice(0, 6).map((actor) => (
                <div
                  key={actor.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedActor(actor.id)}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {actor.username}/{actor.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{actor.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-3">
                    {actor.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

    </div>
  );
}
