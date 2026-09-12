'use strict';
const $ = (id) => document.getElementById(id);
let savedText = '', filename = '無題のテキスト', version = 0;
const dirty = () => $('text').value !== savedText;
function status(message, error = false) {
  $('status').textContent = message;
  $('status').classList.toggle('error', error);
}
function refresh() {
  version++;
  const metrics = measureText($('text').value);
  $('count').textContent = metrics.count.toLocaleString('ja-JP');
  $('compact-count').textContent = metrics.compact.toLocaleString('ja-JP');
  $('lines').textContent = metrics.lines.toLocaleString('ja-JP');
  $('edited').hidden = !dirty();
  $('document-name').textContent = filename;
}
function confirmDiscard() {
  if (!dirty()) return Promise.resolve(true);
  if ($('discard').open) return Promise.resolve(false);
  return new Promise(resolve => {
    $('discard').returnValue = 'cancel';
    $('discard').addEventListener('close', () => resolve($('discard').returnValue === 'discard'), { once: true });
    $('discard').showModal();
  });
}
$('text').addEventListener('input', () => { refresh(); status('文字数を更新しました。'); });
$('new').addEventListener('click', async () => {
  if (!await confirmDiscard()) return;
  $('text').value = savedText = ''; filename = '無題のテキスト';
  refresh(); status('新しいテキストを作成しました。'); $('text').focus();
});
$('open').addEventListener('click', () => $('file').click());
$('file').addEventListener('change', async () => {
  const file = $('file').files[0]; $('file').value = '';
  if (!file) return;
  const readVersion = version;
  try {
    if (file.size > 10 * 1024 * 1024) throw new Error('10 MiB以下のテキストファイルを選んでください。');
    const content = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
    if (readVersion !== version) return status('読み込み中に文章が変更されました。ファイルをもう一度選んでください。', true);
    if (!await confirmDiscard()) return;
    if (readVersion !== version) return;
    $('text').value = content;
    savedText = $('text').value; filename = file.name;
    refresh(); status(`${file.name} を読み込みました。`); $('text').focus();
  } catch (error) {
    status(error instanceof TypeError ? 'UTF-8形式のテキストファイルを選んでください。' : error.message, true);
  }
});
function save() {
  const text = $('text').value;
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename === '無題のテキスト' ? 'text.txt' : filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  savedText = text; refresh(); status('ダウンロードを開始しました。保存先を確認してください。');
}
$('save').addEventListener('click', save);
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault(); save();
  }
});
window.addEventListener('beforeunload', event => {
  if (dirty()) { event.preventDefault(); event.returnValue = ''; }
});
refresh();
