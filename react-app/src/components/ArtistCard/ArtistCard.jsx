import React from "react";
import "./ArtistCard.css";
import { FaSpotify } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";

export default function ArtistCard({ artist }) {
  const { name, image, href } = artist;

  return (
    <div className="artist-card">
      <div className="artist-info">
        <div className="artist-header">
          <p>{name}</p>
          <a
            target="_blank"
            rel="noreferrer"
            href={href}
            className="artist-link"
          >
            <FaSpotify size={24} />
          </a>
        </div>
      </div>
      {image != null ? (
        <img src={image} className="artist-img" alt="artist-img" />
      ) : (
        <BsPersonCircle size={60} />
      )}
    </div>
  );
}
