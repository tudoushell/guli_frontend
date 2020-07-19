import request from "@/utils/request";

export default {
  deleteCourseById(id) {
    return request({
      url: `/edu-service/edu-course/${id}`,
      method: "delete"
    });
  },
  listCourseByCondition(page, row, CourseQueryDto) {
    return request({
      url: `/edu-service/edu-course/${page}/${row}`,
      method: "post",
      data: CourseQueryDto
    });
  },
  publishCourse(id) {
    return request({
      url: `/edu-service/edu-course/publish/${id}`,
      method: "put"
    });
  },
  getPublishCourseInfo(id) {
    return request({
      url: `/edu-service/edu-course/publish/${id}`,
      method: "get"
    });
  },
  getCourse(id) {
    return request({
      url: `/edu-service/edu-course/${id}`,
      method: "get"
    });
  },
  addCourse(course) {
    return request({
      url: "/edu-service/edu-course",
      method: "post",
      data: course
    });
  },
  updateCourse(course) {
    return request({
      url: "/edu-service/edu-course",
      method: "put",
      data: course
    });
  }
};
