import React from "react";
import "./ArtistCard.css";

export default function ArtistCard({ artist }) {
    const { name, image, href } = artist;

    return (
        <div className="artist-card">
            {/* Using 3rd image which is the smallest (160 x 160) to minimize bandwidth */}
            {image != null ? <img src={image} className="artist-img" alt="artist-img" /> : <div></div>}

            <div className="artist-info">
                <div>{name}</div>
                {/* TODO: update external urls to use "safe" urls */}
                <a target="_blank" rel="noreferrer" href={href} className="artist-link">
                    Spotify URL
                </a>
            </div>
        </div>
    );
}

