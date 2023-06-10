package lv.tsi.plamogus.server.component.course.service;

import lv.tsi.plamogus.server.common.service.CrudService;
import lv.tsi.plamogus.server.common.service.QueryService;
import lv.tsi.plamogus.server.component.course.endpoint.CourseQuery;

import java.util.UUID;

public interface CourseService extends CrudService<Course, UUID>, QueryService<Course, CourseQuery> {

}
