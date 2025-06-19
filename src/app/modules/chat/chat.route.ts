import { Router } from "express";
import { chatController } from "./chat.controller";

const router = Router();

router.get("/rooms", chatController.getRooms);
router.post("/rooms", chatController.createRoom);
router.post("/messages", chatController.sendMessage);
router.get("/rooms/:roomId/messages", chatController.getRoomMessages);
router.post("/rooms/join", chatController.joinRoom);

router.post("/rooms/:roomId/participants", chatController.addParticipant);
router.delete(
  "/rooms/:roomId/participants/:userId",
  chatController.removeParticipant
);
router.get("/rooms/:roomId/participants", chatController.getParticipants);
router.get("/rooms/:userId", chatController.getUserRooms);

export const chatRoutes = router;
