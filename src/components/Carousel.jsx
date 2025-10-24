import React from "react";
import { Link } from "react-router-dom";

export default function Carousel({ image, title, to, slug }) {
  const href = to ?? slug ?? "#"; // accepts either
  return (
    <div className="h-72 w-96">
      <Link to={href} className="w-[40%]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-fill rounded-2xl"
        />
      </Link>
    </div>
  );
}
