import Head from 'next/head';
import Link from "next/link"

export default function Home() {

  return (
    <div>
      <Head>
        <title>SpotiPal</title>
      </Head>
      <Link href="/dashboard">
        <button className="btn btn-success" >
        Connect with Spotify
        </button>
      </Link>
      
    </div>
  );
}
