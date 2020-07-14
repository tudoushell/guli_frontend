import request from "@/utils/request";

export default {
  updateChapter(chapterDto) {
    return request({
      url: `/edu-service/edu-chapter`,
      method: "put",
      data: chapterDto
    });
  },
  getChapter(id) {
    return request({
      url: `/edu-service/edu-chapter/chapter/${id}`,
      method: "get"
    });
  },
  deleteChapter(id) {
    return request({
      url: `/edu-service/edu-chapter/${id}`,
      method: "delete"
    });
  },
  addChapter(chapterDto) {
    return request({
      url: `/edu-service/edu-chapter`,
      method: "post",
      data: chapterDto
    });
  },
  listChapter(courseId) {
    return request({
      url: `/edu-service/edu-chapter/${courseId}`,
      method: "get"
    });
  }
};
