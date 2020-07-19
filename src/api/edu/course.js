import request from "@/utils/request";

export default {
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
