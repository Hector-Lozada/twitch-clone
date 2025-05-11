"use client";

import { useParticipants } from "@livekit/components-react";
import { useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { CommunityItem } from "./community-item";
import { LocalParticipant, RemoteParticipant } from "livekit-client";

interface ChatCommunityProps {
  hostName: string;
  viewerName: string;
  isHidden: boolean;
}

export const ChatCommunity = ({
  hostName,
  viewerName,
  isHidden,
}: ChatCommunityProps) => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 500); // Fixed: array destructuring

  const participants = useParticipants();

  const onChange = (newValue: string) => {
    setValue(newValue);
  };

  const filteredParticipants = useMemo(() => {
    const deduped = participants.reduce((acc, participant) => {
      const hostAsViewer = `host-${participant.identity}`;
      if (!acc.some((p) => p.identity === hostAsViewer)) {
        acc.push(participant);
      }
      return acc;
    }, [] as (RemoteParticipant | LocalParticipant)[]);

    return deduped.filter((participant) => {
      return participant.name?.toLowerCase().includes(debouncedValue.toLowerCase());
    });
  }, [participants, debouncedValue]);

  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Comunidad deshabilitada
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Input 
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar comunidad"
        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <ScrollArea className="gap-y-2 mt-4">
        {filteredParticipants.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No se encontraron participantes
          </p>
        ) : (
          filteredParticipants.map((participant) => (
            <CommunityItem
              key={participant.identity}
              hostName={hostName}
              viewerName={viewerName}
              participantName={participant.name || ""}
              participantIdentity={participant.identity}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};