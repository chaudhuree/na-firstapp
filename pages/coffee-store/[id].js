import cls from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CoffeeStores } from "../../lib/CoffeeStores";
import styles from "../../styles/coffeestore.module.css";
import { isEmpty } from "../../utils";
import { StoreContext } from "../_app";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const CoffeeStoresData = await CoffeeStores();
  let data = null;
  try {
    data = CoffeeStoresData.find((CoffeeStore) => {
      return CoffeeStore.fsq_id.toString() === params.id; // params.id is the id from the url which is always a string
    })
  } catch (err) {
    console.log(err.message)
  };
  return {
    props: {
      CoffeeStore: data ? data : {}
    },
  };
}
export async function getStaticPaths() {
  const CoffeeStoresData = await CoffeeStores();
  const paths = CoffeeStoresData.map((Coffeestore) => {
    return { params: { id: Coffeestore.fsq_id.toString() } };
  });
  return {
    // paths: [
    //   { params: { id: "0" } },
    //   { params: { id: "1" } }

    // ],
    paths,
    fallback: true, // false or 'blocking'
  };
}
const handleUpvoteButton = () => {
  console.log("upvotebutton");
};
function CoffeeStore(props) {
  const [coffeeStore, setCoffeeStore] = useState(props.CoffeeStore);
  const { state: { coffeeStores } } = useContext(StoreContext);
  const route = useRouter();
  const id = route.query.id;
  // create useEffect hook
  useEffect(() => {
    if (isEmpty(props.CoffeeStore)) {
      if (coffeeStores.length > 0) {
       let data = coffeeStores?.find((CoffeeStore) => {
          return CoffeeStore.fsq_id.toString() === id; // params.id is the id from the url which is always a string
        })
        setCoffeeStore(data);
      }
    }
  }, [id]);
  console.log(props)

  // if id is not in the getStaticPaths

  if (route.isFallback) {
    return <div>loading....</div>;
  }



  // const { address, name, imgUrl,country } = props.CoffeeStore;
  const { address = "", name = "", imgUrl = "", country = "" } = coffeeStore;

  return (

    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      {/* CoffeeStore id: {route.query.id}
      <div></div> */}
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to Home</a>
            </Link>
          </div>

          {/* <Link href="/dynamic">
        <a>redirect to dynamic</a>
      </Link> */}
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            alt={name}
            width={600}
            height={300}
            className={styles.storeImg}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (<div className={styles.iconWrapper}>
            <Image alt="coffeeStores" src="/static/icons/places.svg" width="24" height="24" />
            <p className={styles.text}>{address}</p>
          </div>)}
          {country && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" alt="coffeeStores" />
              <p className={styles.text}>{country}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image alt="coffeeStores" src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore;
