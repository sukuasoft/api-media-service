export default function getHostDomain() {
  return process.env.HOST ?? `http://localhost:${process.env.PORT ?? 5533}`;
}
