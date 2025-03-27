package com.backend.farmbti.chat.controller;

import com.backend.farmbti.chat.dto.ChatRequest;
import com.backend.farmbti.chat.service.ChatService;
import com.backend.farmbti.common.dto.CommonResponseDto;
import com.backend.farmbti.security.util.SecurityUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chat")
@Tag(name = "채팅 컨트롤러", description = "실시간 채팅을 전반적으로 관리하는 컨트롤러")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SecurityUtils securityUtils;

    @PostMapping("/create")
    @Operation(summary = "채팅방 생성", description = "채팅방 생성 및 기존 채팅방 정보를 반환합니다.")
    public CommonResponseDto createChatRoom(@RequestBody ChatRequest chatRequest) {

        Long userId = securityUtils.getCurrentUsersId();
        return CommonResponseDto.ok(chatService.create(userId, chatRequest));

    }

    @GetMapping("/get/rooms")
    @Operation(summary = "전체 채팅방 목록 조회", description = "전체 채팅방 목록을 조회합니다.")
    public CommonResponseDto getAllRooms() {
        Long userId = securityUtils.getCurrentUsersId();
        return CommonResponseDto.ok(chatService.getAllRooms(userId));
    }

    @DeleteMapping("/delete/{roomId}")
    @Operation(summary = "채팅방 삭제", description = "특정 채팅방을 삭제합니다.")
    public CommonResponseDto deleteRoom(@PathVariable Long roomId) {
        Long usersId = securityUtils.getCurrentUsersId();
        chatService.deleteRoom(usersId, roomId);
        return CommonResponseDto.ok();
    }
    //endOfChat

    @GetMapping("/{roomId}/messages/detail")
    @Operation(summary = "메시지 목록 조회", description = "특정 채팅방의 메시지들을 조회합니다.")
    public CommonResponseDto sendMessage(@PathVariable Long roomId) {

        return CommonResponseDto.ok(chatService.getMessageDetail(roomId));
    }
//
//    @DeleteMapping("/{roomId}/messages/{messageId}")
//    @Operation(summary = "메시지 삭제", description = "특정 메시지를 삭제합니다.")
//    public CommonResponseDto deleteMessage() {
//
//
//        return CommonResponseDto.ok();
//    }
//
//
//    @GetMapping("/notifications")
//    @Operation(summary = "채팅 알림 조회", description = "사용자의 읽지 않은 채팅 알림을 조회합니다.")
//    public CommonResponseDto getNotifications() {
//        return CommonResponseDto.ok();
//    }

}
