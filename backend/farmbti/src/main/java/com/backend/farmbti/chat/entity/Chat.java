package com.backend.farmbti.chat.entity;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.common.entity.TimeStampEntity;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@Builder
@Getter
@Entity
@Table(name = "chat",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id_1", "user_id_2"}
        ))
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자 접근 제한 설정 (JPA 요구사항)
public class Chat extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentee")
    private Users mentee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor")
    private Users mentor;

}
