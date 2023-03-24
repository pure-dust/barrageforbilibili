interface Message<T> {
  id: string;
  timestamp: number;
  type: string;
  body: T;
  raw: any;
}

interface Setting {
  [key: string]: any
  danmu: {
    show_user: boolean,
    show_medal: boolean
    show_time: boolean,
    next_line: boolean,
    time_text_size: number,
    user_text_size: number
    danmu_text_size: number
    time_color: string,
    user_color: string
    danmu_color: string
    [key: string]: any
  }
  gift: {
    hidden: boolean
    show_medal: boolean
    user_text_size: number
    danmu_text_size: number
    user_color: string
    danmu_color: string
    [key: string]: any
  }
  interact: {
    hidden: boolean
    show_medal: boolean
    user_text_size: number
    danmu_text_size: number
    user_color: string
    danmu_color: string
    [key: string]: any
  }
  apperance: {
    transparent: boolean
    background: string
    [key: string]: any
  }
  setting: {
    transparent: boolean
    background: string
    color: string
    size: number
    [key: string]: any
  }
  shield: {
    list: Array<number>
    level: number
  }
}
