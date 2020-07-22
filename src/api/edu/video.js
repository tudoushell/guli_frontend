import request from "@/utils/request";
export default {
  deleteAliVideo(id) {
    return request({
      url: `/vod/${id}`,
      method: "delete"
    });
  },
  updateVideo(eduVideo) {
    return request({
      url: "/edu-service/edu-video",
      method: "put",
      data: eduVideo
    });
  },
  deleteVideo(id) {
    return request({
      url: `/edu-service/edu-video/${id}`,
      method: "delete"
    });
  },
  getVideo(id) {
    return request({
      url: `/edu-service/edu-video/${id}`,
      method: "get"
    });
  },
  addVideo(eduVideo) {
    return request({
      url: "/edu-service/edu-video",
      method: "post",
      data: eduVideo
    });
  }
};
