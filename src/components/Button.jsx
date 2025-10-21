import React from "react";

export default function Button({ title, image, className, link }) {
  return (
    <div>
      <a href={link} className={className}>
        <p className="text-lg">{title}</p>
        <img src={image} alt="" />
      </a>
    </div>
  );
}
