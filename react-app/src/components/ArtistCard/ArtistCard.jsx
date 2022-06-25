import React from "react";
import "./ArtistCard.css";

export default function ArtistCard({ artist }) {
    const { name, images, external_urls } = artist;

    return (
        <div className="artist-card">
            {/* Using 3rd image which is the smallest (160 x 160) to minimize bandwidth */}
            {images != null ? <img src={images[2].url} className="artist-img" alt="artist-img" /> : <div></div>}

            <div className="artist-info">
                <div>{name}</div>
                {/* TODO: update external urls to use "safe" urls */}
                <a target="_blank" rel="noreferrer" href={external_urls} className="artist-link">
                    Spotify URL
                </a>
            </div>
        </div>
    );
}

