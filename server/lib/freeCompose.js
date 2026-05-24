/** Gợi ý lời nhắn miễn phí — chạy trên server, không gọi API trả phí */

const OPENINGS = {
  love: [
    'Có điều anh/chị muốn nói thật nhẹ với em',
    'Em à, đôi khi lời nói muộn hơn cảm xúc — nhưng hôm nay anh/chị muốn gửi em điều này',
    'Giữa muôn vàn điều bận rộn, em vẫn là khoảnh khắc anh/chị muốn dừng lại để nhắn một câu',
  ],
  birthday: [
    'Hôm nay là ngày của em — và anh/chị không muốn để nó trôi qua trong im lặng',
    'Một tuổi mới bắt đầu, và anh/chị muốn là người đầu tiên gửi em lời chúc thật lòng',
  ],
  christmas: [
    'Mùa lễ về, anh/chị nghĩ đến em và muốn gửi một chút ấm áp',
    'Giữa không khí cuối năm, anh/chị muốn em biết mình được nhớ đến',
  ],
  thanks: [
    'Có lẽ anh/chị chưa nói đủ — nhưng hôm nay muốn gửi em lời cảm ơn chân thành',
    'Em đã làm điều ấy với anh/chị, và anh/chị muốn em biết điều đó quan trọng thế nào',
  ],
  condolence: [
    'Anh/chị hiểu đôi khi im lặng cũng là một cách nói',
    'Không có lời nào sửa được mọi chuyện — chỉ mong em biết mình không phải đơn độc',
  ],
  default: [
    'Anh/chị viết vài dòng này với tất cả sự chân thành',
    'Có điều muốn gửi riêng em — như một lá thư nhỏ, không ồn ào',
  ],
}

const CLOSINGS = {
  love: [
    'Yêu em, từ một trái tim không giỏi nói nhưng luôn thật.',
    'Dù sau này thế nào, khoảnh khắc này — anh/chị vẫn chọn em.',
    'Hẹn gặp em, trong những ngày bình yên sắp tới. ♥',
  ],
  birthday: [
    'Chúc em tuổi mới ngập tràn tiếng cười và điều bất ngờ tốt đẹp. 🎂',
    'Mong em luôn được yêu thương đúng cách em xứng đáng.',
  ],
  christmas: [
    'Chúc em Giáng sinh an lành và một năm mới ấm áp. 🎄',
    'Mong mùa lễ này mang đến cho em bình yên thật sự.',
  ],
  thanks: [
    'Cảm ơn em — vì đã tin, đã lắng nghe, đã ở bên.',
    'Hy vọng em cũng nhận lại được điều tốt đẹp tương tự.',
  ],
  condolence: [
    'Mong em từ từ tìm lại nhịp thở bình yên của riêng mình.',
    'Khi nào em cần, anh/chị vẫn ở đây — không cần em phải mạnh mẽ liền.',
  ],
  default: [
    'Hy vọng em đọc xong sẽ mỉm cười một chút.',
    'Gửi em với lòng biết ơn và sự trân trọng.',
  ],
}

const HINT_BODY = {
  cam_on: (name, hint) =>
    `${name ? name + ', ' : ''}${hint ? hint + '. ' : ''}Anh/chị biết ơn em nhiều hơn những gì có thể viết hết trong vài dòng.`,
  xin_loi: (name, hint) =>
    `${name ? name + ', ' : ''}${hint ? hint + '. ' : ''}Anh/chị xin lỗi — không phải vì muốn qua nhanh chuyện đã qua, mà vì thật sự không muốn làm em buồn.`,
  nho: (name, hint) =>
    `${name ? 'Nhớ ' + name + ' ' : 'Nhớ em '}${hint ? '— ' + hint + '. ' : ''}Khoảng cách chỉ làm anh/chị nhận ra em quan trọng đến thế nào.`,
  chuc: (name, hint) =>
    `${name ? 'Gửi ' + name + ', ' : ''}${hint || 'Anh/chị gửi em lời chúc chân thành nhất từ trái tim.'}`,
  yeu: (name, hint) =>
    `${name ? name + ', ' : ''}${hint ? hint + '. ' : ''}Em là điều dịu dàng nhất anh/chị muốn giữ lại mỗi ngày.`,
  default: (name, hint) =>
    `${name ? name + ',\n\n' : ''}${hint || 'Có vài lời anh/chị giấu trong lòng đã lâu — hôm nay muốn gửi hết cho em.'}`,
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function detectHintKind(hint) {
  const h = (hint || '').toLowerCase()
  if (/cảm ơn|cam on|thank/.test(h)) return 'cam_on'
  if (/xin lỗi|xin loi|sorry|lỗi/.test(h)) return 'xin_loi'
  if (/nhớ|nho|miss/.test(h)) return 'nho'
  if (/chúc|chuc|mừng|mung/.test(h)) return 'chuc'
  if (/yêu|yeu|thương|thuong|love/.test(h)) return 'yeu'
  return 'default'
}

function formatName(recipient) {
  const r = (recipient || '').trim()
  if (!r) return ''
  return r.charAt(0).toUpperCase() + r.slice(1)
}

function composeFree(theme, hint, recipient) {
  const t = OPENINGS[theme] ? theme : 'default'
  const name = formatName(recipient)
  const hintTrim = (hint || '').trim()
  const kind = detectHintKind(hintTrim)

  const greeting = name ? `Gửi ${name},\n\n` : ''
  const opening = pick(OPENINGS[t])
  const bodyFn = HINT_BODY[kind] || HINT_BODY.default
  const body = bodyFn(name, hintTrim)
  const closing = pick(CLOSINGS[t])

  const parts = [greeting + opening + '.', '', body, '', closing].filter(
    (line, i, arr) => line !== '' || (i > 0 && arr[i - 1] !== ''),
  )

  return parts.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

module.exports = { composeFree }
