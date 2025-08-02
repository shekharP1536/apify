import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Record<string, unknown>[];
  title?: string;
}

export function DataModal({
  isOpen,
  onClose,
  data,
  title = "Dataset Results",
}: DataModalProps) {
  if (!data || data.length === 0) return null;

  // Get all unique keys from all objects to create table headers
  const getAllKeys = (items: Record<string, unknown>[]): string[] => {
    const keySet = new Set<string>();
    items.forEach((item) => {
      if (typeof item === "object" && item !== null) {
        Object.keys(item).forEach((key) => keySet.add(key));
      }
    });
    return Array.from(keySet).sort();
  };

  const keys = getAllKeys(data);

  // Function to render cell value
  const renderCellValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "";
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // Function to truncate long text
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Showing {data.length} result{data.length !== 1 ? "s" : ""} in table
            format
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                {keys.map((key) => (
                  <TableHead key={key} className="min-w-[150px]">
                    {key}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  {keys.map((key) => {
                    const value = item[key];
                    const cellContent = renderCellValue(value);
                    const isLongContent = cellContent.length > 100;

                    return (
                      <TableCell key={key} className="max-w-xs">
                        {isLongContent ? (
                          <div className="group relative">
                            <div className="truncate">
                              {truncateText(cellContent)}
                            </div>
                            <div className="absolute left-0 top-full mt-1 hidden group-hover:block z-10 max-w-md p-2 bg-popover border border-border rounded-md shadow-md">
                              <pre className="text-xs whitespace-pre-wrap break-all">
                                {cellContent}
                              </pre>
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap break-words">
                            {cellContent}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            Total: {data.length} items
          </div>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
