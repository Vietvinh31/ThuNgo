const express = require('express')
const { composeFree } = require('../lib/freeCompose')

const router = express.Router()

/**
 * Gợi ý lời nhắn — 100% miễn phí, xử lý trên server.
 * Không gọi OpenAI hay dịch vụ trả phí.
 */
router.post('/compose', async (req, res) => {
  const { theme = 'love', hint = '', recipient = '' } = req.body || {}

  try {
    const text = composeFree(theme, hint, recipient)
    res.json({
      text,
      source: 'free',
      message: 'Gợi ý miễn phí — bạn có thể chỉnh sửa trước khi gửi.',
    })
  } catch {
    res.status(500).json({ error: 'Không thể tạo nội dung. Thử lại nhé.' })
  }
})

module.exports = router
