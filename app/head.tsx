const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function Head() {
  return adsenseClient ? (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
        crossOrigin="anonymous"
      />
    </>
  ) : null;
}
