// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import io from "socket.io-client";
import MatchCard from "./components/match-card";
import MatchModal from "./components/match-modal";

interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  team1: string;
  team2: string;
  team1Img: string;
  team2Img: string;
  score: any[];
}

const fetchMatches = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch matches");
  }
  return res.json();
};

const queryClient = new QueryClient();

const Home = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const { data: allMatches = [], isLoading: allMatchesLoading } = useQuery<
    Match[]
  >({
    queryKey: ["matches"],
    queryFn: () =>
      fetchMatches("https://cricket-tracker-backend.onrender.com/matches"),
  });

  const { data: currentMatches = [], isLoading: currentMatchesLoading } =
    useQuery<Match[]>({
      queryKey: ["currentMatches"],
      queryFn: () =>
        fetchMatches(
          "https://cricket-tracker-backend.onrender.com/current-matches"
        ),
    });

  useEffect(() => {
    const socket = io("https://cricket-tracker-backend.onrender.com");

    socket.on("match-updated", (updatedMatch: Match) => {
      queryClient.setQueryData<Match[]>(["matches"], (oldData = []) => {
        const index = oldData.findIndex(
          (match) => match.id === updatedMatch.id
        );
        if (index !== -1) {
          const newMatches = [...oldData];
          newMatches[index] = updatedMatch;
          return newMatches;
        } else {
          return [...oldData, updatedMatch];
        }
      });

      queryClient.setQueryData<Match[]>(["currentMatches"], (oldData = []) => {
        const index = oldData.findIndex(
          (match) => match.id === updatedMatch.id
        );
        if (index !== -1) {
          const newMatches = [...oldData];
          newMatches[index] = updatedMatch;
          return newMatches;
        } else if (updatedMatch.status !== "Match not started") {
          return [...oldData, updatedMatch];
        } else {
          return oldData;
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMatchCardClick = (match: Match) => {
    setSelectedMatch(match);
  };

  console.log("Rendering Home", { allMatches, currentMatches });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">
          Cricket Scores
        </h1>
        <h2 className="text-2xl font-semibold mb-2 text-green-600">
          Current Matches
        </h2>
        {currentMatchesLoading ? (
          <div className="flex justify-center mb-6">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-red-600"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => handleMatchCardClick(match)}
              />
            ))}
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-2 text-red-600">
          All Matches
        </h2>
        {allMatchesLoading ? (
          <div className="flex justify-center">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-red-600"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => handleMatchCardClick(match)}
              />
            ))}
          </div>
        )}
        {selectedMatch && (
          <MatchModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
          />
        )}
      </div>
    </QueryClientProvider>
  );
};

export default Home;
