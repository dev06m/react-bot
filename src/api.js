import axios from 'axios';
import { asset_id }  from './consts/Isimlendirmeler.js'
import { fetchSellingItems, fetchItems, getItemsOnOffers, 
    FirstPriceSet, min_fiyat_getir, MakeOffer, 
    SatistakiItemFiyatiGetir, GetItemsOnOffers,
    fetchItemById, 
    UpdateOffer} from './apiMethods'; 

import { token } from './consts/Isimlendirmeler';

const sleep = ms => new Promise(r => setTimeout(r, ms));



export const hile = async (item, thread) => {
    const temp_item = item;
    // burda bu item fiyati degistigi taktirde guncel fiyati alabilmek icin gerekli ama gerekli olmayabilir
    let satistaki_item = await fetchItemById(item.asset_id); 
    if (satistaki_item != null)
        satistaki_item = {...item, kontrol_araligi: temp_item.kontrol_araligi, baslangic_fiyati: parseFloat(temp_item.baslangic_fiyati), minimum_fiyat: parseFloat(temp_item.minimum_fiyat), bir_saat_bekle: true};

    var selectedItem = item;

    var fiyat_kontrol_dongusu = false;
    var getIdCount = 0;
    var result = null;
    debugger
    result = await GetItemsOnOffers();
    // item satista mi?
    var myItem = result != null ? result.find(x => x.asset_id === item.asset_id) : null;
    var itemPrice = 0;
    if (myItem == null)
    { // ILK BASTA FIYAT SETLEME 
        console.log(`${item.steam_market_hash_name} ilk kez satışa konuyor.`);
        var ilk_setleme_sonuc = await FirstPriceSet(item, item.baslangic_fiyati, item.minimum_fiyat, item.asset_id);
        if (ilk_setleme_sonuc.status == 'success')
            console.log(`${item.steam_market_hash_name} ilk fiyat için setleme başarılı.`);
        else
            console.log(`${item.steam_market_hash_name} ilk fiyat için setleme başarısız.`);
    }
    else // FIYAT UPDATE YAPMA
    {
        selectedItem = myItem;
        selectedItem.kontrol_araligi = item.kontrol_araligi;
        selectedItem.minimum_fiyat = parseFloat(item.minimum_fiyat);
        selectedItem.baslangic_fiyati = parseFloat(item.baslangic_fiyati);
        fiyat_kontrol_dongusu = FiyatGuncelle(item.minimum_fiyat, myItem, item.kontrol_araligi); // minimum fiyati parametre olarak gecmeliyiz cunku objesini sunucudan cekiyor ve onun icinde min fiyat yok
        //Thread.Sleep(varervalTime);
    }
    
            
  }



  const FiyatGuncelle = async (minFiyat, item, miliseconds) =>
        {
            var suggestedPrice = item.steam_item.suggested_price;
            var altLimit = minFiyat; 
            var itemId = item.asset_id;
            var lowestPriceObject = await min_fiyat_getir(item.steam_item.steam_market_hash_name);
            var lowestPrice = lowestPriceObject != null ? lowestPriceObject.toString() : suggestedPrice.toString();
            var varLowestPrice = lowestPrice != null ? lowestPriceObject : suggestedPrice;

            var myItemPrice = item.price;

            var newPrice = varLowestPrice - 0.01;
            var newPricevar = newPrice.toString();
            debugger
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
            var result = await UpdateOffer(item, newPricevar, miliseconds);
            if(result.status == 'success') {
                console.log(`İtem ilk sıraya geçti. Fiyat: ${newPricevar}, Eski fiyat: ${varLowestPrice}. Item: ${item.steam_item.steam_market_hash_name}`);
                return true;
            };
            console.log(`ILK SIRAYA GECIS BASARISIZ ${item.steam_item.steam_market_hash_name}`)
            return false;

        }



export const FiyatDegisikligiCheck = async (item) =>
{   debugger
    const item_name = item.steam_market_hash_name ? item.steam_market_hash_name : item.steam_item.steam_market_hash_name;
    const item_suggested = item.suggested_price ? item.suggested_price : item.steam_item.suggested_price;
    console.log(`${item_name} için fiyat kontrolü yapılıyor.`)
    
    var shadowEnDusukFiyat = await min_fiyat_getir(item_name);
    var itemFiyati = await SatistakiItemFiyatiGetir(item_name); // todouble // burdayimm
    console.log(shadowEnDusukFiyat, itemFiyati)
    if(itemFiyati == null) {
        console.log(`Item satista degil ... ${item.steam_market_hash_name}`)
        return true;
    }

    shadowEnDusukFiyat = shadowEnDusukFiyat != null ? parseFloat(shadowEnDusukFiyat) : item_suggested; // burda kaldim
    if (shadowEnDusukFiyat < itemFiyati)
    {
        console.log(`DÜŞÜK FİYATLI item tespit edildi, fiyat güncleleniyor. (${item_name})\n`);
        return true;
    }
    else if (shadowEnDusukFiyat == itemFiyati)
    {
        return false;
    }
    return false;;
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }







