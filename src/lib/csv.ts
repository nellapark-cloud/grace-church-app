import {
  BAPTISM_TYPES,
  MEMBER_STATUSES,
  type BaptismType,
  type Member,
  type MemberInput,
  type MemberStatus,
} from '../types/member'

const HEADERS = [
  '이름',
  '성별',
  '생년월일',
  '연락처',
  '주소',
  '이메일',
  '직분',
  '소속',
  '세례구분',
  '세례일',
  '등록일',
  '재적상태',
  '비고',
] as const

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function membersToCsv(members: Member[]): string {
  const rows = members.map((m) => [
    m.name,
    m.gender,
    m.birthDate,
    m.phone,
    m.address,
    m.email,
    m.position,
    m.group,
    m.baptismType,
    m.baptismDate,
    m.registeredDate,
    m.status,
    m.memo,
  ])
  const lines = [
    HEADERS.join(','),
    ...rows.map((r) => r.map((v) => escapeCsvField(v ?? '')).join(',')),
  ]
  return '﻿' + lines.join('\r\n')
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function parseCsv(text: string): string[][] {
  const content = text.replace(/^﻿/, '')
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < content.length; i++) {
    const ch = content[i]
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && content[i + 1] === '\n') i++
      row.push(field)
      field = ''
      if (row.length > 1 || row[0] !== '') rows.push(row)
      row = []
    } else {
      field += ch
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows
}

export interface ImportRowError {
  row: number
  reason: string
}

export interface ImportResult {
  members: MemberInput[]
  errors: ImportRowError[]
}

function cell(cells: string[], index: number): string {
  return index >= 0 ? (cells[index] ?? '').trim() : ''
}

export function csvToMemberInputs(text: string): ImportResult {
  const rows = parseCsv(text)
  if (rows.length === 0) return { members: [], errors: [] }

  const header = rows[0].map((h) => h.trim())
  const col = {
    name: header.indexOf('이름'),
    gender: header.indexOf('성별'),
    birthDate: header.indexOf('생년월일'),
    phone: header.indexOf('연락처'),
    address: header.indexOf('주소'),
    email: header.indexOf('이메일'),
    position: header.indexOf('직분'),
    group: header.indexOf('소속'),
    baptismType: header.indexOf('세례구분'),
    baptismDate: header.indexOf('세례일'),
    registeredDate: header.indexOf('등록일'),
    status: header.indexOf('재적상태'),
    memo: header.indexOf('비고'),
  }

  if (col.name === -1) {
    return {
      members: [],
      errors: [{ row: 1, reason: '"이름" 열을 찾을 수 없습니다.' }],
    }
  }

  const members: MemberInput[] = []
  const errors: ImportRowError[] = []

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r]
    if (cells.every((c) => c.trim() === '')) continue

    const name = cell(cells, col.name)
    if (!name) {
      errors.push({ row: r + 1, reason: '이름이 없습니다.' })
      continue
    }

    const genderRaw = cell(cells, col.gender)
    const statusRaw = cell(cells, col.status)
    const baptismTypeRaw = cell(cells, col.baptismType)

    members.push({
      name,
      gender: genderRaw === '여' ? '여' : '남',
      birthDate: cell(cells, col.birthDate),
      phone: cell(cells, col.phone),
      address: cell(cells, col.address),
      email: cell(cells, col.email),
      position: cell(cells, col.position),
      group: cell(cells, col.group),
      baptismType: (BAPTISM_TYPES as string[]).includes(baptismTypeRaw)
        ? (baptismTypeRaw as BaptismType)
        : '',
      baptismDate: cell(cells, col.baptismDate),
      registeredDate: cell(cells, col.registeredDate),
      status: (MEMBER_STATUSES as string[]).includes(statusRaw)
        ? (statusRaw as MemberStatus)
        : '재적',
      photoUrl: '',
      memo: cell(cells, col.memo),
    })
  }

  return { members, errors }
}
