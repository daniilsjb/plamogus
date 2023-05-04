package lv.tsi.uap.server.assignment.service;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lv.tsi.uap.server.course.service.Course;
import lv.tsi.uap.server.step.service.Step;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Assignment {

    @Id
    private UUID id;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(length = 512)
    private String description;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(nullable = false, updatable = false)
    private Instant creationTime;

    @Column
    private Instant deadlineTime;

    @Enumerated(EnumType.ORDINAL)
    private AssignmentType type;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL)
    private List<Step> steps;

    public Assignment(UUID id) {
        this.id = id;
    }

}
