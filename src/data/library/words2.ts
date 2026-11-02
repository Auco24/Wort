// Format: level|pos|en|ru|de|sv|ja — see words1.ts
export const WORDS_2: Record<string, string> = {
  home: `
A1|n|house|дом|das Haus~die Häuser|ett hus~huset, hus|家=いえ
A1|n|apartment, flat|квартира|die Wohnung~die Wohnungen|en lägenhet~lägenheten, lägenheter|アパート
A1|n|room|комната|das Zimmer~die Zimmer|ett rum~rummet, rum|部屋=へや
A1|n|kitchen|кухня|die Küche~die Küchen|ett kök~köket, kök|台所=だいどころ
A1|n|bathroom|ванная|das Badezimmer~die Badezimmer|ett badrum~badrummet, badrum|お風呂=おふろ
A1|n|bedroom|спальня|das Schlafzimmer~die Schlafzimmer|ett sovrum~sovrummet, sovrum|寝室=しんしつ
A1|n|living room|гостиная|das Wohnzimmer~die Wohnzimmer|ett vardagsrum~vardagsrummet, vardagsrum|リビング
A1|n|toilet|туалет|die Toilette~die Toiletten|en toalett~toaletten, toaletter|トイレ
A1|n|door|дверь|die Tür~die Türen|en dörr~dörren, dörrar|ドア
A1|n|window|окно|das Fenster~die Fenster|ett fönster~fönstret, fönster|窓=まど
A1|n|table|стол|der Tisch~die Tische|ett bord~bordet, bord|テーブル
A1|n|chair|стул|der Stuhl~die Stühle|en stol~stolen, stolar|椅子=いす
A1|n|bed|кровать|das Bett~die Betten|en säng~sängen, sängar|ベッド
A2|n|sofa|диван|das Sofa~die Sofas|en soffa~soffan, soffor|ソファー
A2|n|wardrobe|шкаф (для одежды)|der Schrank~die Schränke|en garderob~garderoben, garderober|クローゼット
A2|n|lamp|лампа|die Lampe~die Lampen|en lampa~lampan, lampor|ランプ
A1|n|key|ключ|der Schlüssel~die Schlüssel|en nyckel~nyckeln, nycklar|鍵=かぎ
A2|n|wall|стена|die Wand~die Wände|en vägg~väggen, väggar|壁=かべ
A2|n|floor|пол|der Boden~die Böden|ett golv~golvet, golv|床=ゆか
A2|n|stairs|лестница|die Treppe~die Treppen|en trappa~trappan, trappor|階段=かいだん
A2|n|garden|сад|der Garten~die Gärten|en trädgård~trädgården, trädgårdar|庭=にわ
A2|n|roof|крыша|das Dach~die Dächer|ett tak~taket, tak|屋根=やね
A2|n|fridge|холодильник|der Kühlschrank~die Kühlschränke|ett kylskåp~kylskåpet, kylskåp|冷蔵庫=れいぞうこ
B1|n|washing machine|стиральная машина|die Waschmaschine~die Waschmaschinen|en tvättmaskin~tvättmaskinen, tvättmaskiner|洗濯機=せんたくき
A2|n|shower|душ|die Dusche~die Duschen|en dusch~duschen, duschar|シャワー
A2|n|mirror|зеркало|der Spiegel~die Spiegel|en spegel~spegeln, speglar|鏡=かがみ
A2|n|towel|полотенце|das Handtuch~die Handtücher|en handduk~handduken, handdukar|タオル
B1|n|rent|арендная плата|die Miete~die Mieten|en hyra~hyran, hyror|家賃=やちん
A1|v|live (somewhere)|жить, проживать|wohnen~wohnt, wohnte, hat gewohnt|bo~bor, bodde, bott|住む=すむ
A2|v|clean|убирать|putzen~putzt, putzte, hat geputzt|städa~städar, städade, städat|掃除する=そうじする
A2|v|wash|мыть, стирать|waschen~wäscht, wusch, hat gewaschen|tvätta~tvättar, tvättade, tvättat|洗う=あらう
A1|v|sleep~slept, slept|спать|schlafen~schläft, schlief, hat geschlafen|sova~sover, sov, sovit|寝る=ねる
A2|v|open|открывать|öffnen~öffnet, öffnete, hat geöffnet|öppna~öppnar, öppnade, öppnat|開ける=あける
A2|v|close|закрывать|schließen~schließt, schloss, hat geschlossen|stänga~stänger, stängde, stängt|閉める=しめる
`,
  clothes: `
A1|n|clothes|одежда|die Kleidung|kläder (pl.)~kläderna|服=ふく
A1|n|shirt|рубашка|das Hemd~die Hemden|en skjorta~skjortan, skjortor|シャツ
A1|n|T-shirt|футболка|das T-Shirt~die T-Shirts|en t-shirt~t-shirten, t-shirtar|Tシャツ=ティーシャツ
A1|n|trousers|брюки|die Hose~die Hosen|byxor (pl.)~byxorna|ズボン
A1|n|dress|платье|das Kleid~die Kleider|en klänning~klänningen, klänningar|ワンピース
A2|n|skirt|юбка|der Rock~die Röcke|en kjol~kjolen, kjolar|スカート
A1|n|jacket|куртка|die Jacke~die Jacken|en jacka~jackan, jackor|ジャケット
A2|n|coat|пальто|der Mantel~die Mäntel|en kappa~kappan, kappor|コート
A2|n|sweater|свитер|der Pullover~die Pullover|en tröja~tröjan, tröjor|セーター
A1|n|shoe|ботинок, туфля|der Schuh~die Schuhe|en sko~skon, skor|靴=くつ
A2|n|boot|сапог|der Stiefel~die Stiefel|en stövel~stöveln, stövlar|ブーツ
A2|n|sock|носок|die Socke~die Socken|en strumpa~strumpan, strumpor|靴下=くつした
A2|n|hat|шляпа, шапка|der Hut~die Hüte|en hatt~hatten, hattar|帽子=ぼうし
A2|n|glove|перчатка|der Handschuh~die Handschuhe|en handske~handsken, handskar|手袋=てぶくろ
A2|n|scarf~scarves|шарф|der Schal~die Schals|en halsduk~halsduken, halsdukar|マフラー
A2|n|bag|сумка|die Tasche~die Taschen|en väska~väskan, väskor|かばん
A2|n|belt|ремень|der Gürtel~die Gürtel|ett skärp~skärpet, skärp|ベルト
A2|n|umbrella|зонт|der Regenschirm~die Regenschirme|ett paraply~paraplyet, paraplyer|傘=かさ
B1|n|glasses|очки|die Brille~die Brillen|glasögon (pl.)~glasögonen|眼鏡=めがね
A2|n|watch|наручные часы|die Armbanduhr~die Armbanduhren|ett armbandsur~armbandsuret, armbandsur|腕時計=うでどけい
B1|n|ring|кольцо|der Ring~die Ringe|en ring~ringen, ringar|指輪=ゆびわ
B1|n|size|размер|die Größe~die Größen|en storlek~storleken, storlekar|サイズ
A2|v|wear~wore, worn|носить (одежду)|tragen~trägt, trug, hat getragen|ha på sig~har på sig, hade på sig, haft på sig|着る=きる
B1|v|try on|примерять|anprobieren~probiert an, probierte an, hat anprobiert|prova~provar, provade, provat|試着する=しちゃくする
B1|v|get dressed|одеваться|sich anziehen~zieht sich an, zog sich an, hat sich angezogen|klä på sig~klär på sig, klädde på sig, klätt på sig|着替える=きがえる
`,
  city: `
A1|n|city, town|город|die Stadt~die Städte|en stad~staden, städer|町=まち
A1|n|street|улица|die Straße~die Straßen|en gata~gatan, gator|通り=とおり
A1|n|road, way|дорога, путь|der Weg~die Wege|en väg~vägen, vägar|道=みち
A1|n|car|машина, автомобиль|das Auto~die Autos|en bil~bilen, bilar|車=くるま
A1|n|bus|автобус|der Bus~die Busse|en buss~bussen, bussar|バス
A1|n|train|поезд|der Zug~die Züge|ett tåg~tåget, tåg|電車=でんしゃ
A2|n|underground, subway|метро|die U-Bahn~die U-Bahnen|en tunnelbana~tunnelbanan, tunnelbanor|地下鉄=ちかてつ
A1|n|bicycle|велосипед|das Fahrrad~die Fahrräder|en cykel~cykeln, cyklar|自転車=じてんしゃ
A2|n|taxi|такси|das Taxi~die Taxis|en taxi~taxin, taxibilar|タクシー
A1|n|station|станция, вокзал|der Bahnhof~die Bahnhöfe|en station~stationen, stationer|駅=えき
A2|n|bus stop|остановка|die Haltestelle~die Haltestellen|en hållplats~hållplatsen, hållplatser|バス停=バスてい
A1|n|ticket|билет|die Fahrkarte~die Fahrkarten|en biljett~biljetten, biljetter|切符=きっぷ
A1|n|shop|магазин|das Geschäft~die Geschäfte|en affär~affären, affärer|店=みせ
A2|n|supermarket|супермаркет|der Supermarkt~die Supermärkte|en mataffär~mataffären, mataffärer|スーパー
A1|n|bank|банк|die Bank~die Banken|en bank~banken, banker|銀行=ぎんこう
A2|n|post office|почта|die Post|ett postkontor~postkontoret, postkontor|郵便局=ゆうびんきょく
A2|n|church|церковь|die Kirche~die Kirchen|en kyrka~kyrkan, kyrkor|教会=きょうかい
A2|n|museum|музей|das Museum~die Museen|ett museum~museet, museer|博物館=はくぶつかん
A2|n|library~libraries|библиотека|die Bibliothek~die Bibliotheken|ett bibliotek~biblioteket, bibliotek|図書館=としょかん
A2|n|park|парк|der Park~die Parks|en park~parken, parker|公園=こうえん
A2|n|bridge|мост|die Brücke~die Brücken|en bro~bron, broar|橋=はし
A2|n|square (in a town)|площадь|der Platz~die Plätze|ett torg~torget, torg|広場=ひろば
A2|n|building|здание|das Gebäude~die Gebäude|en byggnad~byggnaden, byggnader|建物=たてもの
A2|n|traffic light|светофор|die Ampel~die Ampeln|ett trafikljus~trafikljuset, trafikljus|信号=しんごう
A2|n|corner|угол|die Ecke~die Ecken|ett hörn~hörnet, hörn|角=かど
B1|n|traffic|дорожное движение|der Verkehr|en trafik~trafiken|交通=こうつう
A2|n|map|карта|die Karte~die Karten|en karta~kartan, kartor|地図=ちず
A1|d|left|налево, слева|links|till vänster|左=ひだり
A1|d|right|направо, справа|rechts|till höger|右=みぎ
A1|d|straight ahead|прямо|geradeaus|rakt fram|まっすぐ
A1|a|near|близкий, рядом|nah|nära|近い=ちかい
A1|a|far|далёкий, далеко|weit|långt borta|遠い=とおい
A1|v|go~went, gone|идти|gehen~geht, ging, ist gegangen|gå~går, gick, gått|行く=いく
A2|v|drive~drove, driven|водить машину, ехать|fahren~fährt, fuhr, ist gefahren|köra~kör, körde, kört|運転する=うんてんする
A2|v|get off|выходить (из транспорта)|aussteigen~steigt aus, stieg aus, ist ausgestiegen|gå av~går av, gick av, gått av|降りる=おりる
A2|v|get on|садиться (в транспорт)|einsteigen~steigt ein, stieg ein, ist eingestiegen|gå på~går på, gick på, gått på|乗る=のる
A2|v|turn|поворачивать|abbiegen~biegt ab, bog ab, ist abgebogen|svänga~svänger, svängde, svängt|曲がる=まがる
`,
  travel: `
A1|n|trip, journey|поездка, путешествие|die Reise~die Reisen|en resa~resan, resor|旅行=りょこう
A1|n|holiday, vacation|отпуск, каникулы|der Urlaub~die Urlaube|en semester~semestern, semestrar|休み=やすみ
A1|n|airport|аэропорт|der Flughafen~die Flughäfen|en flygplats~flygplatsen, flygplatser|空港=くうこう
A1|n|plane|самолёт|das Flugzeug~die Flugzeuge|ett flygplan~flygplanet, flygplan|飛行機=ひこうき
A2|n|flight|рейс, перелёт|der Flug~die Flüge|ett flyg~flyget, flyg|フライト
A1|n|hotel|гостиница|das Hotel~die Hotels|ett hotell~hotellet, hotell|ホテル
A1|n|passport|паспорт|der Reisepass~die Reisepässe|ett pass~passet, pass|パスポート
A2|n|suitcase|чемодан|der Koffer~die Koffer|en resväska~resväskan, resväskor|スーツケース
A2|n|luggage|багаж|das Gepäck|ett bagage~bagaget|荷物=にもつ
A2|n|booking, reservation|бронирование|die Reservierung~die Reservierungen|en bokning~bokningen, bokningar|予約=よやく
A2|n|beach|пляж|der Strand~die Strände|en strand~stranden, stränder|ビーチ
A2|n|tourist|турист|der Tourist~die Touristen|en turist~turisten, turister|観光客=かんこうきゃく
A2|n|sight (attraction)|достопримечательность|die Sehenswürdigkeit~die Sehenswürdigkeiten|en sevärdhet~sevärdheten, sevärdheter|名所=めいしょ
A2|n|souvenir|сувенир|das Souvenir~die Souvenirs|en souvenir~souveniren, souvenirer|お土産=おみやげ
A2|n|border|граница|die Grenze~die Grenzen|en gräns~gränsen, gränser|国境=こっきょう
A1|n|country|страна|das Land~die Länder|ett land~landet, länder|国=くに
A2|d|abroad|за границей|im Ausland|utomlands|海外=かいがい
A2|n|tent|палатка|das Zelt~die Zelte|ett tält~tältet, tält|テント
B1|n|departure|отправление|die Abfahrt~die Abfahrten|en avgång~avgången, avgångar|出発=しゅっぱつ
B1|n|arrival|прибытие|die Ankunft~die Ankünfte|en ankomst~ankomsten, ankomster|到着=とうちゃく
B1|n|delay|задержка, опоздание|die Verspätung~die Verspätungen|en försening~förseningen, förseningar|遅れ=おくれ
A2|n|tour guide|гид|der Reiseführer~die Reiseführer|en guide~guiden, guider|ガイド
A2|v|travel|путешествовать|reisen~reist, reiste, ist gereist|resa~reser, reste, rest|旅行する=りょこうする
A2|v|fly~flew, flown|летать|fliegen~fliegt, flog, ist geflogen|flyga~flyger, flög, flugit|飛ぶ=とぶ
A2|v|book|бронировать|buchen~bucht, buchte, hat gebucht|boka~bokar, bokade, bokat|予約する=よやくする
A2|v|arrive|прибывать|ankommen~kommt an, kam an, ist angekommen|komma fram~kommer fram, kom fram, kommit fram|着く=つく
B1|v|pack|собирать вещи|packen~packt, packte, hat gepackt|packa~packar, packade, packat|荷造りする=にづくりする
A2|v|visit|посещать|besuchen~besucht, besuchte, hat besucht|besöka~besöker, besökte, besökt|訪ねる=たずねる
`,
  nature: `
A1|n|weather|погода|das Wetter|ett väder~vädret|天気=てんき
A1|n|sun|солнце|die Sonne~die Sonnen|en sol~solen, solar|太陽=たいよう
A1|n|rain|дождь|der Regen|ett regn~regnet|雨=あめ
A1|n|snow|снег|der Schnee|en snö~snön|雪=ゆき
A2|n|wind|ветер|der Wind~die Winde|en vind~vinden, vindar|風=かぜ
A2|n|cloud|облако|die Wolke~die Wolken|ett moln~molnet, moln|雲=くも
A2|n|storm|буря|der Sturm~die Stürme|en storm~stormen, stormar|嵐=あらし
A2|n|sky~skies|небо|der Himmel~die Himmel|en himmel~himlen, himlar|空=そら
A2|n|moon|луна|der Mond~die Monde|en måne~månen, månar|月=つき
A2|n|star|звезда|der Stern~die Sterne|en stjärna~stjärnan, stjärnor|星=ほし
A1|n|sea|море|das Meer~die Meere|ett hav~havet, hav|海=うみ
A2|n|lake|озеро|der See~die Seen|en sjö~sjön, sjöar|湖=みずうみ
A2|n|river|река|der Fluss~die Flüsse|en flod~floden, floder|川=かわ
A2|n|mountain|гора|der Berg~die Berge|ett berg~berget, berg|山=やま
A2|n|forest|лес|der Wald~die Wälder|en skog~skogen, skogar|森=もり
A2|n|tree|дерево|der Baum~die Bäume|ett träd~trädet, träd|木=き
A2|n|flower|цветок|die Blume~die Blumen|en blomma~blomman, blommor|花=はな
A2|n|grass|трава|das Gras~die Gräser|ett gräs~gräset|草=くさ
A2|n|island|остров|die Insel~die Inseln|en ö~ön, öar|島=しま
B1|n|field|поле|das Feld~die Felder|ett fält~fältet, fält|畑=はたけ
A2|n|stone|камень|der Stein~die Steine|en sten~stenen, stenar|石=いし
B1|n|ground, earth|земля, почва|die Erde|en jord~jorden|地面=じめん
B1|n|nature|природа|die Natur|en natur~naturen|自然=しぜん
B1|n|environment|окружающая среда|die Umwelt|en miljö~miljön|環境=かんきょう
A1|n|spring|весна|der Frühling~die Frühlinge|en vår~våren, vårar|春=はる
A1|n|summer|лето|der Sommer~die Sommer|en sommar~sommaren, somrar|夏=なつ
A1|n|autumn|осень|der Herbst~die Herbste|en höst~hösten, höstar|秋=あき
A1|n|winter|зима|der Winter~die Winter|en vinter~vintern, vintrar|冬=ふゆ
A1|a|warm|тёплый|warm|varm~varmt, varma|暖かい=あたたかい
A1|a|hot (weather)|жаркий|heiß|het~hett, heta|暑い=あつい
A1|a|cold (weather)|холодный|kalt|kall~kallt, kalla|寒い=さむい
A2|a|sunny|солнечный|sonnig|solig~soligt, soliga|晴れ=はれ
A2|a:en,de,sv|rainy|дождливый|regnerisch|regnig~regnigt, regniga|雨=あめ
A2|a|cloudy|облачный|bewölkt|molnig~molnigt, molniga|曇り=くもり
B1|n|temperature|температура|die Temperatur~die Temperaturen|en temperatur~temperaturen, temperaturer|気温=きおん
A2|v|rain|идти (о дожде)|regnen~es regnet, es regnete, es hat geregnet|regna~det regnar, det regnade, det har regnat|雨が降る=あめがふる
`,
  animals: `
A1|n|animal|животное|das Tier~die Tiere|ett djur~djuret, djur|動物=どうぶつ
A1|n|dog|собака|der Hund~die Hunde|en hund~hunden, hundar|犬=いぬ
A1|n|cat|кошка|die Katze~die Katzen|en katt~katten, katter|猫=ねこ
A1|n|bird|птица|der Vogel~die Vögel|en fågel~fågeln, fåglar|鳥=とり
A1|n|horse|лошадь|das Pferd~die Pferde|en häst~hästen, hästar|馬=うま
A1|n|cow|корова|die Kuh~die Kühe|en ko~kon, kor|牛=うし
A2|n|pig|свинья|das Schwein~die Schweine|en gris~grisen, grisar|豚=ぶた
A2|n|sheep~sheep|овца|das Schaf~die Schafe|ett får~fåret, får|羊=ひつじ
A2|n|hen, chicken|курица (птица)|das Huhn~die Hühner|en höna~hönan, hönor|鶏=にわとり
A2|n|mouse~mice|мышь|die Maus~die Mäuse|en mus~musen, möss|ねずみ
A2|n|rabbit|кролик|das Kaninchen~die Kaninchen|en kanin~kaninen, kaniner|うさぎ
A2|n|bear|медведь|der Bär~die Bären|en björn~björnen, björnar|熊=くま
A2|n|wolf~wolves|волк|der Wolf~die Wölfe|en varg~vargen, vargar|狼=おおかみ
A2|n|fox|лиса|der Fuchs~die Füchse|en räv~räven, rävar|狐=きつね
B1|n|deer~deer|олень|der Hirsch~die Hirsche|ett rådjur~rådjuret, rådjur|鹿=しか
B1|n|elk, moose|лось|der Elch~die Elche|en älg~älgen, älgar|ヘラジカ
A2|n|monkey|обезьяна|der Affe~die Affen|en apa~apan, apor|猿=さる
A2|n|elephant|слон|der Elefant~die Elefanten|en elefant~elefanten, elefanter|象=ぞう
A2|n|lion|лев|der Löwe~die Löwen|ett lejon~lejonet, lejon|ライオン
B1|n|snake|змея|die Schlange~die Schlangen|en orm~ormen, ormar|蛇=へび
A2|n|insect|насекомое|das Insekt~die Insekten|en insekt~insekten, insekter|虫=むし
B1|n|butterfly~butterflies|бабочка|der Schmetterling~die Schmetterlinge|en fjäril~fjärilen, fjärilar|蝶=ちょう
B1|n|bee|пчела|die Biene~die Bienen|ett bi~biet, bin|蜂=はち
B1|n|spider|паук|die Spinne~die Spinnen|en spindel~spindeln, spindlar|蜘蛛=くも
A2|n|duck|утка|die Ente~die Enten|en anka~ankan, ankor|アヒル
B1|n|whale|кит|der Wal~die Wale|en val~valen, valar|鯨=くじら
B1|n|tail|хвост|der Schwanz~die Schwänze|en svans~svansen, svansar|尻尾=しっぽ
B1|n|pet|домашнее животное|das Haustier~die Haustiere|ett husdjur~husdjuret, husdjur|ペット
`,
};
