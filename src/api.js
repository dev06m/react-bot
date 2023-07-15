import axios from 'axios';
import { fetchSellingItems, fetchItems, getItemsOnOffers, 
    FirstPriceSet, ItemFiyatGetir, MakeOffer, 
    SatistakiItemFiyatiGetir, GetItemsOnOffers,
    fetchItemById } from './apiMethods'; 

import { token } from './consts/Isimlendirmeler';

const sleep = ms => new Promise(r => setTimeout(r, ms));



export const hile = async (item, thread) => {
            var selectedItem = item;
            item = await fetchItemById('31520880069');
            if (item != null)
                item = {...item, intervalTime: 2000, baslangicFiyati: 40, minimumFiyat: 20, bir_saat_bekle: true};

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
                    var ilk_setleme_sonuc = FirstPriceSet(item, item.baslangicFiyati, item.minimumFiyat, item.asset_id);
                    if (ilk_setleme_sonuc === "E")
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
                    selectedItem.varerval_time = item.intervalTime;
                    selectedItem.minimum_fiyat = item.minimumFiyat.Tovar;
                    selectedItem.baslangic_fiyati = item.baslangicFiyati;
                    selectedItem.bir_saat_bekle = item.bir_saat_bekle.Tovar;
                    fiyat_kontrol_dongusu = FiyatGuncelle(item.minFiyat, myItem, item.intervalTime); // minimum fiyati parametre olarak gecmeliyiz cunku objesini sunucudan cekiyor ve onun icinde min fiyat yok
                    //Thread.Sleep(varervalTime);
                }
                
                // FIYAT DEGISIKLIGI VAR MI?
                while(fiyat_kontrol_dongusu)
                {
                    if (!FiyatDegisikligiCheck(selectedItem))
                        fiyat_kontrol_dongusu = false;
                    item.bir_saat_bekle = selectedItem.bir_saat_bekle;
                    //Thread.Sleep(item.varerval_time); // 1,5 saniyede bir bak
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
            var lowestPriceObject = ItemFiyatGetir(item.steam_item.steam_market_hash_name).Result;
            var lowestPrice = lowestPriceObject != null ? lowestPriceObject.toString() : suggestedPrice.toString();
            var varLowestPrice = lowestPrice != null ? lowestPriceObject : suggestedPrice;

            var myItemPrice = item.price;

            var newPrice = varLowestPrice - 0.01;
            var newPricevar = newPrice.toString();
            if (newPrice < altLimit)
            {
                item.alt_limit++;
                //Console.WriteLine($"Alt limite takıldı, 1 dk bekleme başladı__{itemName}__\n");
                //Thread.Sleep(60000);
                //Console.WriteLine($"1 dk bekleme bitt, başlangıc fiyatına setlenecek __{itemName}__\n ");
                var result_ = MakeOffer(item, item.baslangic_fiyati.Tovar(), miliseconds);
                return false;
            }
            if ((myItemPrice < varLowestPrice || myItemPrice == 0)) 
            {
                //Console.WriteLine($"İtem en düşük fiyat ya da fiyatı sıfır __{itemName}__\n");
                return false;
            }
            var result = MakeOffer(item, newPricevar, miliseconds);
            if(result.status == "success") {
                //Console.WriteLine($"İtem fiyati degisti, yeni fiyat: {newPricevar} eski fiyat: {varLowestPrice} __{itemName}__ \n");
                return true;
            };
            return false;

        }



const FiyatDegisikligiCheck = (item) =>
{
    var dongu = true;
    var sabitlenecek_zaman = 2000// Isimlendirmeler.SABITLENECEK_ZAMAN;

    var shadowEnDusukFiyat = ItemFiyatGetir(item.steam_item.steam_market_hash_name).Result;
    var itemFiyati = (SatistakiItemFiyatiGetir(item.steam_item.steam_market_hash_name)); // todouble
    if (itemFiyati == null || itemFiyati == 0)
    {
        //Console.WriteLine("İtem fiyatı null ya da 0");
        //dongu = false;
    }

    shadowEnDusukFiyat = shadowEnDusukFiyat != null ? shadowEnDusukFiyat : item.steam_item.suggested_price;
    if (shadowEnDusukFiyat < itemFiyati)
    {
        //Console.WriteLine($"DÜŞÜK FİYATLI item tespit edildi, fiyat güncleleniyor. ({item.steam_item.steam_market_hash_name})\n");
        dongu = false;
        item.bir_saat_bekle = 0;
    }
    else if (shadowEnDusukFiyat == itemFiyati)
    {
        //if(item.bir_saat_bekle + 1 % 5 == 0)
            //Console.WriteLine($"İtem fiyatı sitedeki en düşük fiyata eşit - {item.bir_saat_bekle+1}. deneme. __{item.steam_item.steam_market_hash_name}__\n");
        item.bir_saat_bekle = item.bir_saat_bekle + 1;
    }
    if(item.bir_saat_bekle == 100)
    {
        //Console.WriteLine($"100 kez fiyat kontrolü yapıldı, fiyat {sabitlenecek_zaman / (1000 * 60)} dk süresince sabitlenecek .");
        //Thread.Sleep(sabitlenecek_zaman); // bir süre sabit fiyatla bekle
        //Console.WriteLine($"{sabitlenecek_zaman / (1000*60)} dk beklendi, fiyat {item.baslangic_fiyati} $'a setlenecek, sonra güncellenecek.");
        MakeOffer(item, item.baslangic_fiyati.ToString(), item.varerval_time); // bir süre bekledikten sonra başlangıc fiyatına setle ve donguden çıkarak fiyatı tekrar setlgüncelle.
        dongu = false;
        item.bir_saat_bekle = 0;
    }
    return dongu;
}







