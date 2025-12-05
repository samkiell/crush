import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { receiveMessage, setTypingUser } from "@/store/slices/chatSlice";

export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Initialize Socket
    const socketInitializer = async () => {
      await fetch("/api/socket/io");

      socketRef.current = io({
        path: "/api/socket/io",
        addTrailingSlash: false,
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to socket");
      });

      socketRef.current.on("receive_message", (message) => {
        dispatch(receiveMessage(message));
      });

      // Listen for message:new as per new requirement
      socketRef.current.on("message:new", (message) => {
        dispatch(receiveMessage(message));
      });

      socketRef.current.on("typing:start", ({ roomId, user }) => {
        dispatch(
          setTypingUser({
            roomId,
            userId: user.userId,
            username: user.name,
            isTyping: true,
          })
        );
      });

      socketRef.current.on("typing:end", ({ roomId, user }) => {
        dispatch(
          setTypingUser({
            roomId,
            userId: user.userId,
            username: user.name,
            isTyping: false,
          })
        );
      });

      setSocket(socketRef.current);
    };

    socketInitializer();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [dispatch, user]);

  return socket;
};
