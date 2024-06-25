import React from "react";

interface MatchCardProps {
  match: {
    id: string;
    name: string;
    status: string;
    team1: string;
    team2: string;
    team1Img: string;
    team2Img: string;
  };
  onClick: (match: MatchCardProps["match"]) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  return (
    <div
      className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition-transform transform hover:scale-105"
      onClick={() => onClick(match)}
    >
      <div className="flex items-center justify-between gap-4">
        <img
          src={match.team1Img}
          alt={match.team1}
          className="w-12 h-12 rounded-full"
        />
        <span className="text-base font-bold">
          {match.team1} vs {match.team2}
        </span>
        <img
          src={match.team2Img}
          alt={match.team2}
          className="w-12 h-12 rounded-full"
        />
      </div>
      <p className="mt-2 text-gray-600">{match.name}</p>
      <p
        className={`mt-1 font-semibold ${
          match.status.includes("Live") ? "text-red-600" : "text-gray-800"
        }`}
      >
        {match.status}
      </p>
    </div>
  );
};

export default MatchCard;
