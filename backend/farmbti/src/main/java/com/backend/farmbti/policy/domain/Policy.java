package com.backend.farmbti.policy.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "policy")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "policy_id")
	private Long id;

	@Column(length = 50, nullable = false)
	private String region;

	@Column(name = "registration_date", length = 50, nullable = false)
	private String registrationDate;

	@Column(length = 100, nullable = false)
	private String title;

	@Column(length = 500, nullable = false)
	private String description;

	@Column(length = 500, nullable = false)
	private String target;

	@Column(length = 200, nullable = false)
	private String support;

}