"use client";
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  const [lastAmount, setLastAmount] = useState(0);
  const [newAmount, setNewAmount] = useState(amount);

  useEffect(() => {
    setLastAmount(newAmount);
    setNewAmount(amount);
  }, [amount]);

  return <CountUp start={lastAmount} end={newAmount} />;
};

export default AnimatedCounter;
