/** Kho lời chúc — chạy 100% trên client, không cần server */

export const BLESSING_CATEGORIES = [
  {
    id: 'love',
    label: 'Tình yêu',
    emoji: '❤️',
    themeId: 'love',
    items: [
      'Em là điều dịu dàng nhất anh/chị muốn giữ lại mỗi ngày. Cảm ơn em đã ở bên.',
      'Anh/chị không giỏi nói lời yêu thương, nhưng mỗi ngày bên em đều là điều anh/chị trân trọng nhất.',
      'Dù sau này thế nào, khoảnh khắc này — anh/chị vẫn chọn em. ♥',
      'Có những điều chỉ dám gửi qua lá thư nhỏ như thế này: em được yêu, và không bao giờ là điều hiển nhiên.',
      'Hôm nay anh/chị chỉ muốn em biết — em là lý do anh/chị mỉm cười khi ngày dài mệt mỏi.',
      'Nếu được chọn lại, anh/chị vẫn muốn gặp em vào đúng thời điểm ấy.',
    ],
  },
  {
    id: 'birthday',
    label: 'Sinh nhật',
    emoji: '🎂',
    themeId: 'birthday',
    items: [
      'Chúc mừng sinh nhật! Mong tuổi mới mang đến nhiều tiếng cười, bình an và điều bất ngờ tốt đẹp. 🎂',
      'Một tuổi mới — một hành trình mới. Chúc em luôn rực rỡ và được yêu thương đúng cách em xứng đáng.',
      'Hôm nay là ngày của em. Anh/chị gửi lời chúc chân thành: hạnh phúc, khỏe mạnh và tràn đầy yêu thương.',
      'Chúc em sinh nhật vui vẻ! Mong mọi điều em ước đều dần thành hiện thực.',
      'Tuổi mới rồi — nhưng với anh/chị, em vẫn là người đáng được chúc mừng nhất hôm nay.',
    ],
  },
  {
    id: 'friends',
    label: 'Bạn bè',
    emoji: '🤝',
    themeId: 'thanks',
    items: [
      'Cảm ơn vì đã là bạn đồng hành — những ngày vui buồn đều nhẹ hơn khi có em.',
      'Biết em là may mắn. Chúc em luôn vững vàng và gặp nhiều điều tốt đẹp phía trước.',
      'Dù không nói nhiều, anh/chị vẫn trân trọng tình bạn này. Cảm ơn em nhé!',
      'Chúc bạn thân yêu của anh/chị một ngày thật tuyệt — xứng đáng với người tốt như em.',
      'Hẹn gặp lại trong những buổi trà chiều và tiếng cười không cần lý do.',
    ],
  },
  {
    id: 'sorry',
    label: 'Xin lỗi',
    emoji: '🙏',
    themeId: 'default',
    items: [
      'Anh/chị xin lỗi — không phải vì muốn qua nhanh chuyện đã qua, mà vì thật sự không muốn làm em buồn.',
      'Có lẽ anh/chị đã vô tình. Xin em một cơ hội để lắng nghe và sửa sai.',
      'Lời xin lỗi muộn nhưng chân thành. Anh/chị mong em bình an, dù chưa chắc em đã tha thứ.',
      'Anh/chị nhận ra mình sai. Cảm ơn em vì đã kiên nhẫn — dù điều đó không phải nghĩa vụ của em.',
      'Nếu được, anh/chị muốn bắt đầu lại từ một câu chuyện nhẹ nhàng hơn.',
    ],
  },
  {
    id: 'thanks',
    label: 'Tri ân',
    emoji: '🌸',
    themeId: 'thanks',
    items: [
      'Cảm ơn em — vì đã tin, đã lắng nghe và đã ở bên khi anh/chị cần.',
      'Điều em làm với anh/chị không nhỏ. Anh/chị muốn em biết điều đó.',
      'Lời cảm ơn chưa bao giờ đủ, nhưng hôm nay anh/chị muốn gửi hết trong vài dòng này.',
      'Cảm ơn vì đã là ánh sáng nhỏ trong những ngày u ám của anh/chị.',
    ],
  },
  {
    id: 'christmas',
    label: 'Giáng sinh',
    emoji: '🎄',
    themeId: 'christmas',
    items: [
      'Giáng sinh an lành! Mong mùa lễ này mang đến cho em ấm áp và bình yên thật sự. 🎄',
      'Chúc em Noel vui vẻ và một năm mới tràn đầy hy vọng.',
      'Giữa không khí cuối năm, anh/chị nhớ em và gửi chút ấm áp qua lá thư nhỏ này.',
    ],
  },
  {
    id: 'comfort',
    label: 'An ủi',
    emoji: '🕊️',
    themeId: 'condolence',
    items: [
      'Anh/chị hiểu đôi khi lời nói không đủ — chỉ mong em biết mình không đơn độc.',
      'Mong em từ từ tìm lại nhịp thở bình yên, theo đúng thời gian của riêng em.',
      'Khi nào em cần, anh/chị vẫn ở đây — không cần em phải mạnh mẽ ngay.',
    ],
  },
]

/** Map theme trang → tab mặc định trong kho lời chúc */
export function categoryIdForTheme(themeId) {
  const map = {
    love: 'love',
    birthday: 'birthday',
    thanks: 'friends',
    default: 'sorry',
    christmas: 'christmas',
    condolence: 'comfort',
  }
  return map[themeId] || 'love'
}

export function getCategory(id) {
  return BLESSING_CATEGORIES.find((c) => c.id === id) || BLESSING_CATEGORIES[0]
}
