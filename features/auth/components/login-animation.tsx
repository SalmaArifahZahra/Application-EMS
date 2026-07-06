"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function LoginAnimation() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/animations/login.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) {
    return <p>Loading animation...</p>;
  }

  return (
    <Lottie
      animationData={animationData}
      loop
      className="h-112.5 w-112.5"
    />
  );
}