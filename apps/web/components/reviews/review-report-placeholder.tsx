"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";

export function ReviewReportPlaceholder() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Button type="button" variant="ghost" className="h-9 px-3 text-xs" onClick={() => setIsOpen((open) => !open)}>
        Report review
      </Button>
      {isOpen ? (
        <Notice tone="info">
          Review reporting is planned next. The MVP keeps this visible for signed-in users, but does not persist reports yet.
        </Notice>
      ) : null}
    </div>
  );
}
