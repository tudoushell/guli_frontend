import request from "@/utils/request";

export default {
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
