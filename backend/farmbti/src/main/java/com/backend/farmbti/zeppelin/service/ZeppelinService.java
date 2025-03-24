package com.backend.farmbti.zeppelin.service;

import com.backend.farmbti.zeppelin.client.ZeppelinClient;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ZeppelinService {

    private final ZeppelinClient zeppelinClient;

    public ZeppelinService(ZeppelinClient zeppelinClient) {
        this.zeppelinClient = zeppelinClient;
    }

    public String runNotebookWithParamsForAll(String noteId, Map<String, Object> params) throws InterruptedException {
        // 모든 paragraph ID 가져오기
        List<String> paragraphIds = zeppelinClient.getParagraphIds(noteId);
        if (paragraphIds.isEmpty()) return "Paragraph가 없습니다.";

        // 모든 paragraph에 파라미터 설정(all 실행 시 param 적용 x)
        for (String paragraphId : paragraphIds) {
            // 1. 각 단락에 파라미터 설정
            zeppelinClient.setParagraphParams(noteId, paragraphId, params);

            // 2. 각 단락을 파라미터와 함께 실행
            zeppelinClient.runParagraphWithParams(noteId, paragraphId, params);

            // 3. 각 단락이 완료될 때까지 대기
            waitForParagraphCompletion(noteId, paragraphId);
        }

        // 마지막 paragraph 결과 반환 (또는 필요한 단락 결과 반환)
        String lastParagraphId = paragraphIds.get(paragraphIds.size() - 1);
        return zeppelinClient.getParagraphResult(noteId, lastParagraphId);
    }

    // 단일 paragraph 실행 완료 대기
    private void waitForParagraphCompletion(String noteId, String paragraphId) throws InterruptedException {
        int maxRetries = 30; // 최대 30초 대기

        while (maxRetries-- > 0) {
            Thread.sleep(1000); // 1초마다 체크
            Map<String, String> statusMap = zeppelinClient.getNoteJobStatus(noteId);
            String status = statusMap.get(paragraphId);

            if (status != null && (status.equals("FINISHED") || status.equals("ERROR") || status.equals("ABORT"))) {
                break;
            }
        }
    }
}
