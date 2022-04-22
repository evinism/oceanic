import { tag } from "./elements";
import { HtmlTag } from "./htmltypes";
/* Removed elements: var, head, body, html, script, style, title, link, noscript */
/* There are likely others that are missed right now */

const elements: { [key in HtmlTag]: ReturnType<typeof tag> } = {
  a: tag<"a">("a"),
  abbr: tag<"abbr">("abbr"),
  address: tag<"address">("address"),
  area: tag<"area">("area"),
  article: tag<"article">("article"),
  aside: tag<"aside">("aside"),
  audio: tag<"audio">("audio"),
  b: tag<"b">("b"),
  base: tag<"base">("base"),
  bdi: tag<"bdi">("bdi"),
  bdo: tag<"bdo">("bdo"),
  blockquote: tag<"blockquote">("blockquote"),
  br: tag<"br">("br"),
  button: tag<"button">("button"),
  canvas: tag<"canvas">("canvas"),
  caption: tag<"caption">("caption"),
  cite: tag<"cite">("cite"),
  code: tag<"code">("code"),
  col: tag<"col">("col"),
  colgroup: tag<"colgroup">("colgroup"),
  data: tag<"data">("data"),
  datalist: tag<"datalist">("datalist"),
  dd: tag<"dd">("dd"),
  del: tag<"del">("del"),
  details: tag<"details">("details"),
  dfn: tag<"dfn">("dfn"),
  dialog: tag<"dialog">("dialog"),
  div: tag<"div">("div"),
  dl: tag<"dl">("dl"),
  dt: tag<"dt">("dt"),
  em: tag<"em">("em"),
  embed: tag<"embed">("embed"),
  fieldset: tag<"fieldset">("fieldset"),
  figure: tag<"figure">("figure"),
  figcaption: tag<"figcaption">("figcaption"),
  footer: tag<"footer">("footer"),
  form: tag<"form">("form"),
  h1: tag<"h1">("h1"),
  h2: tag<"h2">("h2"),
  h3: tag<"h3">("h3"),
  h4: tag<"h4">("h4"),
  h5: tag<"h5">("h5"),
  h6: tag<"h6">("h6"),
  head: tag<"head">("head"),
  header: tag<"header">("header"),
  hgroup: tag<"hgroup">("hgroup"),
  hr: tag<"hr">("hr"),
  i: tag<"i">("i"),
  iframe: tag<"iframe">("iframe"),
  img: tag<"img">("img"),
  input: tag<"input">("input"),
  ins: tag<"ins">("ins"),
  kbd: tag<"kbd">("kbd"),
  label: tag<"label">("label"),
  legend: tag<"legend">("legend"),
  li: tag<"li">("li"),
  link: tag<"link">("link"),
  main: tag<"main">("main"),
  map: tag<"map">("map"),
  mark: tag<"mark">("mark"),
  menu: tag<"menu">("menu"),
  menuitem: tag<"menuitem">("menuitem"),
  meta: tag<"meta">("meta"),
  meter: tag<"meter">("meter"),
  nav: tag<"nav">("nav"),
  object: tag<"object">("object"),
  ol: tag<"ol">("ol"),
  optgroup: tag<"optgroup">("optgroup"),
  option: tag<"option">("option"),
  output: tag<"output">("output"),
  p: tag<"p">("p"),
  param: tag<"param">("param"),
  pre: tag<"pre">("pre"),
  progress: tag<"progress">("progress"),
  q: tag<"q">("q"),
  rb: tag<"rb">("rb"),
  rp: tag<"rp">("rp"),
  rt: tag<"rt">("rt"),
  rtc: tag<"rtc">("rtc"),
  ruby: tag<"ruby">("ruby"),
  s: tag<"s">("s"),
  samp: tag<"samp">("samp"),
  section: tag<"section">("section"),
  select: tag<"select">("select"),
  small: tag<"small">("small"),
  source: tag<"source">("source"),
  span: tag<"span">("span"),
  strong: tag<"strong">("strong"),
  sub: tag<"sub">("sub"),
  summary: tag<"summary">("summary"),
  sup: tag<"sup">("sup"),
  table: tag<"table">("table"),
  tbody: tag<"tbody">("tbody"),
  td: tag<"td">("td"),
  template: tag<"template">("template"),
  textarea: tag<"textarea">("textarea"),
  tfoot: tag<"tfoot">("tfoot"),
  th: tag<"th">("th"),
  thead: tag<"thead">("thead"),
  time: tag<"time">("time"),
  title: tag<"title">("title"),
  tr: tag<"tr">("tr"),
  track: tag<"track">("track"),
  u: tag<"u">("u"),
  ul: tag<"ul">("ul"),
  video: tag<"video">("video"),
  wbr: tag<"wbr">("wbr"),
};

export const a = elements.a;
export const abbr = elements.abbr;
export const address = elements.address;
export const area = elements.area;
export const article = elements.article;
export const aside = elements.aside;
export const audio = elements.audio;
export const b = elements.b;
export const base = elements.base;
export const bdi = elements.bdi;
export const bdo = elements.bdo;
export const blockquote = elements.blockquote;
export const br = elements.br;
export const button = elements.button;
export const canvas = elements.canvas;
export const caption = elements.caption;
export const cite = elements.cite;
export const code = elements.code;
export const col = elements.col;
export const colgroup = elements.colgroup;
export const data = elements.data;
export const datalist = elements.datalist;
export const dd = elements.dd;
export const del = elements.del;
export const details = elements.details;
export const dfn = elements.dfn;
export const dialog = elements.dialog;
export const div = elements.div;
export const dl = elements.dl;
export const dt = elements.dt;
export const em = elements.em;
export const embed = elements.embed;
export const fieldset = elements.fieldset;
export const figure = elements.figure;
export const figcaption = elements.figcaption;
export const footer = elements.footer;
export const form = elements.form;
export const h1 = elements.h1;
export const h2 = elements.h2;
export const h3 = elements.h3;
export const h4 = elements.h4;
export const h5 = elements.h5;
export const h6 = elements.h6;
export const head = elements.head;
export const header = elements.header;
export const hgroup = elements.hgroup;
export const hr = elements.hr;
export const i = elements.i;
export const iframe = elements.iframe;
export const img = elements.img;
export const input = elements.input;
export const ins = elements.ins;
export const kbd = elements.kbd;
export const label = elements.label;
export const legend = elements.legend;
export const li = elements.li;
export const link = elements.link;
export const main = elements.main;
export const map = elements.map;
export const mark = elements.mark;
export const menu = elements.menu;
export const menuitem = elements.menuitem;
export const meta = elements.meta;
export const meter = elements.meter;
export const nav = elements.nav;
export const object = elements.object;
export const ol = elements.ol;
export const optgroup = elements.optgroup;
export const option = elements.option;
export const output = elements.output;
export const p = elements.p;
export const param = elements.param;
export const pre = elements.pre;
export const progress = elements.progress;
export const q = elements.q;
export const rb = elements.rb;
export const rp = elements.rp;
export const rt = elements.rt;
export const rtc = elements.rtc;
export const ruby = elements.ruby;
export const s = elements.s;
export const samp = elements.samp;
export const section = elements.section;
export const select = elements.select;
export const small = elements.small;
export const source = elements.source;
export const span = elements.span;
export const strong = elements.strong;
export const sub = elements.sub;
export const summary = elements.summary;
export const sup = elements.sup;
export const table = elements.table;
export const tbody = elements.tbody;
export const td = elements.td;
export const template = elements.template;
export const textarea = elements.textarea;
export const tfoot = elements.tfoot;
export const th = elements.th;
export const thead = elements.thead;
export const time = elements.time;
export const title = elements.title;
export const tr = elements.tr;
export const track = elements.track;
export const u = elements.u;
export const ul = elements.ul;
export const video = elements.video;
export const wbr = elements.wbr;

export default elements;
