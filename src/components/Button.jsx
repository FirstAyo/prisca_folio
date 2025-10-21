import { Mails } from "lucide-react";
import React from "react";

export default function Button({ title, image, className, link }) {
  return (
    <div className="">
      <a href={link} className={className}>
        <p className="text-lg">{title}</p>
        <img src={image} alt="" className="h-4 w-4 object-cover" />
      </a>
    </div>
  );
}
