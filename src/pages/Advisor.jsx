import { useState } from "react";
import axiosClient from "../api/axiosClient";

export default function Advisor() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  const ask = async () => {
    try {
      const r = await axiosClient.post("/advise/", { message: input });
      setReply(r.data.reply);
    } catch (err) {
      setReply("Error fetching advice.");
    }
  };

  return (
    <div className="advisor-box">
      <h2>ZeekingAI Advisor</h2>
      <textarea onChange={(e)=>setInput(e.target.value)} />
      <button onClick={ask}>Ask</button>
      <p className="reply">{reply}</p>
    </div>
  );
}
