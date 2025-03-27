package com.backend.farmbti.chat.entity;

import com.backend.farmbti.auth.domain.Users;
import com.backend.farmbti.common.entity.TimeStampEntity;
import com.backend.farmbti.mentors.domain.Mentors;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@Builder
@Getter
@Entity
@Table(name = "chat",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"users_id", "mentors_id"}
        ))
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자 접근 제한 설정 (JPA 요구사항)
public class Chat extends TimeStampEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id")
    private Users mentee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentors_id")
    private Mentors mentor;


}
