
import http from '@/utils/http'

const SERVICE = '/gf-article-service'

// 根据id获取文章详情
export function getArticleDetail(id) {
  return http.get(`${SERVICE}/api/article/open/${id}`)
}

// 关注/取消关注文章(flag：1关注/0取消关注)
export function focus(articleId, flag) {
  return http.get(`${SERVICE}/api/focus/focus/${articleId}/${flag}`)
}

// 评论列表{ articleId pageNo pageSize }
export function getCommentList(data) {
  return http.post(`${SERVICE}/api/article/comments/open/page`, data)
}

// 点赞文章
export function likeArticle(articleId) {
  return http.post(`${SERVICE}/api/article/like`, { articleId: articleId })
}

// 取消点赞文章
export function cancelLikeArticle(articleId) {
  return http.post(`${SERVICE}/api/article/cancel_like/${articleId}`)
}

// 添加评论{ articleId content }
export function addComment(data) {
  return http.post(`${SERVICE}/api/article/comments/add`, data)
}

// 点赞评论
export function likeComment(id) {
  return http.post(`${SERVICE}/api/article/comments/like`, {evaluateId: id})
}
// 取消点赞评论
export function cancelLikeComment(evaluateId) {
  return http.post(`${SERVICE}/api/article/comments/cancel_like/${evaluateId}`)
}

// 转发文章加积分
export function shareArticle(id) {
  return http.get(`${SERVICE}/api/article/open/share/${id}`)
}

// 阅读文章
export function read(id) {
  return http.get(`${SERVICE}/api/article/open/read/${id}`)
}