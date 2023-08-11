import * as iconv from 'iconv-lite'

export default {
  methods: {
    download(fileData, fileName) {
      const encoded = iconv.encode(fileData, 'win1251')

      const url = window.URL.createObjectURL(new Blob([encoded]), { type: 'text/csv;charset=windows-1251' })
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)

      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    }
  }
}