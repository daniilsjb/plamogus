package lv.tsi.uap.server.component.course.service;

import lv.tsi.uap.server.common.service.CrudService;
import lv.tsi.uap.server.common.service.QueryService;
import lv.tsi.uap.server.component.course.endpoint.CourseQuery;

import java.util.UUID;

public interface CourseService extends CrudService<Course, UUID>, QueryService<Course, CourseQuery> {

}