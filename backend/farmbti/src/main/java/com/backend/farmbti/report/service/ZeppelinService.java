package com.backend.farmbti.report.service;

import com.backend.farmbti.report.client.ZeppelinClient;
import com.backend.farmbti.report.exception.ZeppelinErrorCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import com.backend.farmbti.common.exception.GlobalException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ZeppelinService {

    private final ZeppelinClient zeppelinClient;

    public ZeppelinService(ZeppelinClient zeppelinClient) {
        this.zeppelinClient = zeppelinClient;
    }

    public String runNotebookWithParamsForAll(String noteId, Map<String, Object> params) throws InterruptedException {
        // 파라미터 유효성 검사
        if (noteId == null || noteId.isEmpty()) {
            throw new GlobalException(ZeppelinErrorCode.INVALID_PARAMETER);
        }

        if (params == null || params.isEmpty()) {
            throw new GlobalException(ZeppelinErrorCode.INVALID_PARAMETER);
        }

        try {
            // 모든 paragraph ID 가져오기
            List<String> paragraphIds = zeppelinClient.getParagraphIds(noteId);

            // 노트북 존재 여부 검사 (클라이언트에서 오류가 발생했는지 확인)
            if (paragraphIds == null) {
                throw new GlobalException(ZeppelinErrorCode.NOTEBOOK_NOT_FOUND);
            }

            // 단락 존재 여부 검사
            if (paragraphIds.isEmpty()) {
                throw new GlobalException(ZeppelinErrorCode.PARAGRAPH_NOT_FOUND);
            }

            // 모든 paragraph에 파라미터 설정 및 실행
            for (String paragraphId : paragraphIds) {
                try {
                    // 1. 각 단락에 파라미터 설정
                    zeppelinClient.setParagraphParams(noteId, paragraphId, params);

                    // 2. 각 단락을 파라미터와 함께 실행
                    zeppelinClient.runParagraphWithParams(noteId, paragraphId, params);

                    // 3. 각 단락이 완료될 때까지 대기
                    waitForParagraphCompletion(noteId, paragraphId);
                } catch (GlobalException e) {
                    throw e; // 전역 예외는 그대로 전파
                } catch (Exception e) {
                    throw new GlobalException(ZeppelinErrorCode.EXECUTION_FAILED);
                }
            }

            // 마지막 paragraph 결과 반환
            String lastParagraphId = paragraphIds.get(paragraphIds.size() - 1);
            String result = zeppelinClient.getParagraphResult(noteId, lastParagraphId);

            if (result == null || result.isEmpty()) {
                throw new GlobalException(ZeppelinErrorCode.EXECUTION_FAILED);
            }

            return result;
        } catch (Exception e) {
            // API 호출 실패 등 다른 예외가 발생하면 적절한 오류 코드 선택
            if (e.getMessage() != null && e.getMessage().contains("Not Found")) {
                throw new GlobalException(ZeppelinErrorCode.NOTEBOOK_NOT_FOUND);
            }
            throw new GlobalException(ZeppelinErrorCode.EXECUTION_FAILED);
        }
    }

    // 단일 paragraph 실행 완료 대기
    private void waitForParagraphCompletion(String noteId, String paragraphId) throws InterruptedException {
        int maxRetries = 30; // 최대 30초 대기
        boolean completed = false;

        while (maxRetries-- > 0) {
            Thread.sleep(1000); // 1초마다 체크
            Map<String, String> statusMap = zeppelinClient.getNoteJobStatus(noteId);

            // 상태 확인 실패 시 예외 처리
            if (statusMap == null) {
                throw new GlobalException(ZeppelinErrorCode.EXECUTION_FAILED);
            }

            String status = statusMap.get(paragraphId);

            if (status == null) {
                continue; // 상태 정보가 없으면 다시 체크
            }

            if (status.equals("FINISHED")) {
                completed = true;
                break;
            } else if (status.equals("ERROR")) {
                throw new GlobalException(ZeppelinErrorCode.EXECUTION_FAILED);
            } else if (status.equals("ABORT")) {
                throw new GlobalException(ZeppelinErrorCode.EXECUTION_FAILED);
            }
        }

        if (!completed) {
            throw new GlobalException(ZeppelinErrorCode.TIMEOUT);
        }
    }

    public List<String> extractTopRegions(String rawZeppelinResult) {
        List<String> regionList = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(rawZeppelinResult);
            log.debug("🩵Parsed JSON root: " + root.toString());
            String data = root.path("body").path("results").path("msg").get(0).path("data").asText();
            log.debug("🩵Body node: " + data.toString());

            if (data == null || data.isEmpty()) {
                throw new GlobalException(ZeppelinErrorCode.EMPTY_RESULT);
            }

            String[] lines = data.split("\n");
            for (String line : lines) {
                if (line.startsWith("|") && !line.contains("full_region")) {
                    String[] parts = line.split("\\|");
                    if (parts.length > 1) {
                        String region = parts[1].trim();
                        regionList.add(region);
                    }
                }
            }

            log.debug("🩵Raw Zeppelin result: " + rawZeppelinResult);

            if (regionList.isEmpty()) {
                throw new GlobalException(ZeppelinErrorCode.EMPTY_RESULT);
            }

            return regionList;

        } catch (Exception e) {
            log.error("🩵Error parsing Zeppelin result: ", e);
            throw new GlobalException(ZeppelinErrorCode.RESULT_PARSE_FAILED);
        }
    }


}