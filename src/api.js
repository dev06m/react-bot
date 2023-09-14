import axios from 'axios';
import { asset_id }  from './consts/Isimlendirmeler.js'
import { fetchSellingItems, fetchItems, getItemsOnOffers, 
    FirstPriceSet, min_fiyat_getir, MakeOffer, 
    SatistakiItemFiyatiGetir, GetItemsOnOffers,
    fetchItemById } from './apiMethods'; 

import { token } from './consts/Isimlendirmeler';

const sleep = ms => new Promise(r => setTimeout(r, ms));



export const hile = async (item, thread) => {
    
            item = await fetchItemById(asset_id);
            if (item != null)
                item = {...item, intervalTime: 2000, baslangicFiyati: 14, minimumFiyat: 11, bir_saat_bekle: true};

            var selectedItem = item;

            const dongu = true;
            /*
            const intervalTime = item.interval_time;
            var asset_id = item.asset_id;
            //var suggestedPrice= item.steam_item.suggested_price.Tovar(); // buraya bak
            var baslangicFiyati = parseFloat(item.baslangic_fiyati);
            var minimumFiyat = parseFloat(item.minimum_fiyat);
            var bir_saat_bekle = item.bir_saat_bekle;
            var count = 1;
            var minFiyat = item.minimum_fiyat;
            */
            
            while (dongu)
            {
                var fiyat_kontrol_dongusu = false;
                var getIdCount = 0;
                var result = null;

                result = await GetItemsOnOffers();
                // item satista mi?
                var myItem = result.data != null ? result.data.find(x => x.asset_id === item.asset_id) : null;
                var itemPrice = 0;
                debugger
                if (myItem == null)
                { // ILK BASTA FIYAT SETLEME 
                    var ilk_setleme_sonuc = await FirstPriceSet(item, item.baslangicFiyati, item.minimumFiyat, item.asset_id);
                    if (ilk_setleme_sonuc.status == 200)
                        fiyat_kontrol_dongusu = true;
                    else
                        fiyat_kontrol_dongusu = false;

                    if (ilk_setleme_sonuc === "satildi")
                    {
                        //dongu = false;
                        return;
                    }
                    //Thread.Sleep(varervalTime);
                }

                else // FIYAT UPDATE YAPMA
                {
                    selectedItem = myItem;
                    selectedItem.interval_time = item.intervalTime;
                    selectedItem.minimum_fiyat = item.minimumFiyat.Tovar;
                    selectedItem.baslangic_fiyati = item.baslangicFiyati;
                    selectedItem.bir_saat_bekle = item.bir_saat_bekle.Tovar;
                    fiyat_kontrol_dongusu = FiyatGuncelle(item.minFiyat, myItem, item.intervalTime); // minimum fiyati parametre olarak gecmeliyiz cunku objesini sunucudan cekiyor ve onun icinde min fiyat yok
                    //Thread.Sleep(varervalTime);
                }
                
                // FIYAT DEGISIKLIGI VAR MI?
                while(fiyat_kontrol_dongusu)
                {
                    if (await !FiyatDegisikligiCheck(selectedItem))
                        fiyat_kontrol_dongusu = false;
                    item.bir_saat_bekle = selectedItem.bir_saat_bekle;
                    //Thread.Sleep(item.varerval_time); // 1,5 saniyede bir bak
                    setTimeout(() => {
                        console.log('beklemede')
                    }, 5000);
                    console.log('gecti')
                }


                // if (count % 100 == 0)
                
                // count++;
            }
            
  }



  const FiyatGuncelle = (minFiyat, item, miliseconds) =>
        {
            //item = 
            var suggestedPrice = item.steam_item.suggested_price;
            var altLimit = minFiyat; 
            var itemId = item.asset_id.Tovar();
            var itemName = item.steam_item.steam_market_hash_name;
            var lowestPriceObject = min_fiyat_getir(item.steam_item.steam_market_hash_name).Result;
            var lowestPrice = lowestPriceObject != null ? lowestPriceObject.toString() : suggestedPrice.toString();
            var varLowestPrice = lowestPrice != null ? lowestPriceObject : suggestedPrice;

            var myItemPrice = item.price;

            var newPrice = varLowestPrice - 0.01;
            var newPricevar = newPrice.toString();
            if (newPrice < altLimit)
            {
                item.alt_limit++;
                //console.log($"Alt limite takıldı, 1 dk bekleme başladı__{itemName}__\n");
                //Thread.Sleep(60000);
                //console.log($"1 dk bekleme bitt, başlangıc fiyatına setlenecek __{itemName}__\n ");
                var result_ = MakeOffer(item, item.baslangic_fiyati.Tovar(), miliseconds);
                return false;
            }
            if ((myItemPrice < varLowestPrice || myItemPrice == 0)) 
            {
                //console.log($"İtem en düşük fiyat ya da fiyatı sıfır __{itemName}__\n");
                return false;
            }
            var result = MakeOffer(item, newPricevar, miliseconds);
            if(result.status == "success") {
                //console.log($"İtem fiyati degisti, yeni fiyat: {newPricevar} eski fiyat: {varLowestPrice} __{itemName}__ \n");
                return true;
            };
            return false;

        }



export const FiyatDegisikligiCheck = async (item) =>
{
    debugger
    var dongu = true;
    var sabitlenecek_zaman = 2000// Isimlendirmeler.SABITLENECEK_ZAMAN;
    console.log('sabitlenecek zaman')
    var shadowEnDusukFiyat = await min_fiyat_getir(item.steam_market_hash_name);
    //var shadowEnDusukFiyat = 10;
    var itemFiyati = await SatistakiItemFiyatiGetir(item.steam_market_hash_name); // todouble // burdayimm
    if (itemFiyati == null || itemFiyati == 0)
    {
        console.log('İtem fiyatı null ya da 0')
        dongu = false;
    }

    shadowEnDusukFiyat = shadowEnDusukFiyat != null ? parseFloat(shadowEnDusukFiyat) : item.steam_item.suggested_price;
    if (shadowEnDusukFiyat < itemFiyati)
    {
        console.log(`DÜŞÜK FİYATLI item tespit edildi, fiyat güncleleniyor. (${item.steam_item.steam_market_hash_name})\n`);
        dongu = false;
        item.bir_saat_bekle = 0;
    }
    else if (shadowEnDusukFiyat == itemFiyati)
    {
        //if(item.bir_saat_bekle + 1 % 5 == 0)
            //console.log($"İtem fiyatı sitedeki en düşük fiyata eşit - {item.bir_saat_bekle+1}. deneme. __{item.steam_item.steam_market_hash_name}__\n");
        item.bir_saat_bekle = item.bir_saat_bekle + 1;
    }
    if(item.bir_saat_bekle == 100)
    {
        console.log(`100 kez fiyat kontrolü yapıldı, fiyat ${sabitlenecek_zaman / (1000 * 60)} dk süresince sabitlenecek .`);
        //Thread.Sleep(sabitlenecek_zaman); // bir süre sabit fiyatla bekle
        //console.log($"{sabitlenecek_zaman / (1000*60)} dk beklendi, fiyat {item.baslangic_fiyati} $'a setlenecek, sonra güncellenecek.");
        MakeOffer(item, item.baslangic_fiyati.ToString(), item.varerval_time); // bir süre bekledikten sonra başlangıc fiyatına setle ve donguden çıkarak fiyatı tekrar setlgüncelle.
        dongu = false;
        item.bir_saat_bekle = 0;
    }
    return dongu;
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }







