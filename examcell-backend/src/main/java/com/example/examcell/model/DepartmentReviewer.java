package com.example.examcell.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "department_reviewer")
public class DepartmentReviewer {
    @EmbeddedId
    private DepartmentReviewerId departmentReviewerId;
    @OneToOne
    @MapsId("userName")
    @JoinColumn(name = "user_name")
    private User user;
    @OneToOne
    @MapsId("departmentId")
    @JoinColumn(name = "department_id")
    private Department department;
}
