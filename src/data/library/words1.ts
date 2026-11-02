// Format of one line:  level|pos|en|ru|de|sv|ja
//  pos: n noun, v verb, a adjective, d adverb, p phrase, o other; "n:ja" = only for these languages
//  en / de / sv: "word~forms";  de/sv nouns start with their article (der/die/das, en/ett)
//  ja: "kanji=reading~forms" (reading omitted for kana-only words)
export const WORDS_1: Record<string, string> = {
  basics: `
A1|p|hello|привет, здравствуйте|hallo|hej|こんにちは
A1|p|goodbye|до свидания|auf Wiedersehen|hej då|さようなら
A1|p|good morning|доброе утро|guten Morgen|god morgon|おはようございます
A1|p|good evening|добрый вечер|guten Abend|god kväll|こんばんは
A1|p|good night|спокойной ночи|gute Nacht|god natt|おやすみなさい
A1|p|thank you|спасибо|danke|tack|ありがとう
A1|p|please|пожалуйста (просьба)|bitte|snälla|お願いします=おねがいします
A1|p|you're welcome|пожалуйста (в ответ на спасибо)|gern geschehen|ingen orsak|どういたしまして
A1|p|excuse me|извините|Entschuldigung|ursäkta|すみません
A1|p|sorry|простите|es tut mir leid|förlåt|ごめんなさい
A1|o|yes|да|ja|ja|はい
A1|o|no|нет|nein|nej|いいえ
A1|p|how are you?|как дела?|wie geht es dir?|hur mår du?|お元気ですか=おげんきですか
A1|p|I'm fine|у меня всё хорошо|mir geht es gut|jag mår bra|元気です=げんきです
A1|p|nice to meet you|приятно познакомиться|freut mich|trevligt att träffas|はじめまして
A1|p|my name is …|меня зовут …|ich heiße …|jag heter …|私は…です=わたしは…です
A1|p|what is your name?|как тебя зовут?|wie heißt du?|vad heter du?|お名前は何ですか=おなまえはなんですか
A1|p|I don't understand|я не понимаю|ich verstehe nicht|jag förstår inte|分かりません=わかりません
A1|p|do you speak English?|вы говорите по-английски?|sprechen Sie Englisch?|pratar du engelska?|英語を話せますか=えいごをはなせますか
A1|p|could you repeat that, please?|повторите, пожалуйста|können Sie das bitte wiederholen?|kan du upprepa det?|もう一度お願いします=もういちどおねがいします
A1|p|more slowly, please|медленнее, пожалуйста|langsamer, bitte|långsammare, tack|ゆっくりお願いします=ゆっくりおねがいします
A1|p|I don't know|я не знаю|ich weiß nicht|jag vet inte|知りません=しりません
A1|p|of course|конечно|natürlich|självklart|もちろん
A1|p|it's OK|всё в порядке, ничего страшного|das ist okay|det är okej|大丈夫です=だいじょうぶです
A1|p|see you later|увидимся|bis später|vi ses|また後で=またあとで
A1|p|welcome|добро пожаловать|willkommen|välkommen|ようこそ
A2|p|congratulations|поздравляю|herzlichen Glückwunsch|grattis|おめでとうございます
A2|p|good luck|удачи|viel Glück|lycka till|頑張って=がんばって
A1|p|cheers!|будем здоровы! (тост)|prost!|skål!|乾杯=かんぱい
A2|p|have a nice day|хорошего дня|schönen Tag noch|ha en bra dag|良い一日を=よいいちにちを
A1|p|help!|помогите!|Hilfe!|hjälp!|助けて=たすけて
A1|p|where is …?|где …?|wo ist …?|var är …?|…はどこですか
A1|p|how much does it cost?|сколько это стоит?|wie viel kostet das?|hur mycket kostar det?|いくらですか
A2|p|I would like …|я бы хотел(а) …|ich möchte …|jag skulle vilja …|…をください
`,
  words: `
A1|o|what|что|was|vad|何=なに
A1|o|who|кто|wer|vem|誰=だれ
A1|o|where|где|wo|var|どこ
A1|o|when|когда|wann|när|いつ
A1|o|why|почему|warum|varför|なぜ
A1|o|how|как|wie|hur|どう
A1|o|which|какой, который|welcher|vilken|どれ
A1|o|how many|сколько|wie viele|hur många|いくつ
A1|o|I|я|ich|jag|私=わたし
A1|o|you|ты|du|du|あなた
A1|o|he|он|er|han|彼=かれ
A1|o|she|она|sie|hon|彼女=かのじょ
A1|o|we|мы|wir|vi|私たち=わたしたち
A1|o:en,sv,ja|they|они|sie (Pl.)|de|彼ら=かれら
A1|o|and|и|und|och|そして
A1|o|but|но|aber|men|でも
A1|o|or|или|oder|eller|または
A1|o|because|потому что|weil|eftersom|ので
A2|o|if|если|wenn|om|もし
A1|o|with|с (вместе с)|mit|med|と一緒に=といっしょに
A1|o|without|без|ohne|utan|なしで
A1|d|here|здесь|hier|här|ここ
A1|d|there|там|dort|där|そこ
A1|d|now|сейчас|jetzt|nu|今=いま
A1|d|always|всегда|immer|alltid|いつも
A1|d|never|никогда|nie|aldrig|決して=けっして
A1|d|often|часто|oft|ofta|よく
A1|d|sometimes|иногда|manchmal|ibland|時々=ときどき
A1|d|very|очень|sehr|mycket|とても
A1|d|also|тоже, также|auch|också|も
A1|d|only|только|nur|bara|だけ
A1|d|already|уже|schon|redan|もう
A2|d|still|всё ещё|noch|fortfarande|まだ
A1|d|again|снова|wieder|igen|また
A1|d|together|вместе|zusammen|tillsammans|一緒に=いっしょに
A1|d|maybe|может быть|vielleicht|kanske|かもしれない
A2|d|almost|почти|fast|nästan|ほとんど
A1|o|everything|всё|alles|allt|全部=ぜんぶ
A1|o|nothing|ничего|nichts|ingenting|何も=なにも
A1|o|someone|кто-то|jemand|någon|誰か=だれか
A1|d:en,de,ja|a lot, much|много|viel|mycket|たくさん
A1|d|a little|немного|ein bisschen|lite|少し=すこし
`,
  people: `
A1|n|person~people|человек|der Mensch~die Menschen|en människa~människan, människor|人=ひと
A1|n|man~men|мужчина|der Mann~die Männer|en man~mannen, män|男の人=おとこのひと
A1|n|woman~women|женщина|die Frau~die Frauen|en kvinna~kvinnan, kvinnor|女の人=おんなのひと
A1|n|child~children|ребёнок|das Kind~die Kinder|ett barn~barnet, barn|子供=こども
A1|n|boy|мальчик|der Junge~die Jungen|en pojke~pojken, pojkar|男の子=おとこのこ
A1|n|girl|девочка|das Mädchen~die Mädchen|en flicka~flickan, flickor|女の子=おんなのこ
A1|n|family|семья|die Familie~die Familien|en familj~familjen, familjer|家族=かぞく
A1|n|mother|мама, мать|die Mutter~die Mütter|en mamma~mamman, mammor|母=はは
A1|n|father|папа, отец|der Vater~die Väter|en pappa~pappan, pappor|父=ちち
A1|n|parents|родители|Eltern (Pl.)|föräldrar (pl.)~föräldrarna|両親=りょうしん
A1|n:en,de,sv|brother|брат|der Bruder~die Brüder|en bror~brodern, bröder|兄弟=きょうだい
A1|n:en,de,sv|sister|сестра|die Schwester~die Schwestern|en syster~systern, systrar|姉妹=しまい
A1|n:ja|older brother|старший брат|der ältere Bruder|storebror|兄=あに
A1|n:ja|younger brother|младший брат|der jüngere Bruder|lillebror|弟=おとうと
A1|n:ja|older sister|старшая сестра|die ältere Schwester|storasyster|姉=あね
A1|n:ja|younger sister|младшая сестра|die jüngere Schwester|lillasyster|妹=いもうと
A1|n|son|сын|der Sohn~die Söhne|en son~sonen, söner|息子=むすこ
A1|n|daughter|дочь|die Tochter~die Töchter|en dotter~dottern, döttrar|娘=むすめ
A2|n|grandmother|бабушка|die Großmutter~die Großmütter|en mormor/farmor|祖母=そぼ
A2|n|grandfather|дедушка|der Großvater~die Großväter|en morfar/farfar|祖父=そふ
A2|n|husband|муж|der Ehemann~die Ehemänner|en make~maken, makar|夫=おっと
A2|n|wife~wives|жена|die Ehefrau~die Ehefrauen|en fru~frun, fruar|妻=つま
A1|n|friend|друг|der Freund~die Freunde|en vän~vännen, vänner|友達=ともだち
A2|n|neighbour|сосед|der Nachbar~die Nachbarn|en granne~grannen, grannar|近所の人=きんじょのひと
A2|n|baby|младенец|das Baby~die Babys|en bebis~bebisen, bebisar|赤ちゃん=あかちゃん
A2|n|uncle|дядя|der Onkel~die Onkel|en morbror/farbror|おじ
A2|n|aunt|тётя|die Tante~die Tanten|en moster/faster|おば
A2|n|cousin|двоюродный брат, двоюродная сестра|der Cousin~die Cousins|en kusin~kusinen, kusiner|いとこ
B1|n|relative|родственник|der Verwandte~die Verwandten|en släkting~släktingen, släktingar|親戚=しんせき
A2|n|boyfriend|парень, молодой человек|der feste Freund|en pojkvän~pojkvännen, pojkvänner|彼氏=かれし
A2|n|girlfriend|девушка, подруга|die Freundin~die Freundinnen|en flickvän~flickvännen, flickvänner|恋人=こいびと
A1|n|name|имя|der Name~die Namen|ett namn~namnet, namn|名前=なまえ
A1|n|age|возраст|das Alter|en ålder~åldern, åldrar|年齢=ねんれい
B1|n|marriage|брак|die Ehe~die Ehen|ett äktenskap~äktenskapet, äktenskap|結婚=けっこん
A2|v|marry|жениться, выйти замуж|heiraten~heiratet, heiratete, hat geheiratet|gifta sig~gifter sig, gifte sig, gift sig|結婚する=けっこんする
A2|a|young|молодой|jung|ung~ungt, unga|若い=わかい
A2|a|old (person)|пожилой, старый|alt|gammal~gammalt, gamla|年を取った=としをとった
A2|a|married|женатый, замужем|verheiratet|gift|結婚している=けっこんしている
A2|n|adult|взрослый|der Erwachsene~die Erwachsenen|en vuxen~den vuxne, vuxna|大人=おとな
`,
  body: `
A1|n|body|тело|der Körper~die Körper|en kropp~kroppen, kroppar|体=からだ
A1|n|head|голова|der Kopf~die Köpfe|ett huvud~huvudet, huvuden|頭=あたま
A1|n|face|лицо|das Gesicht~die Gesichter|ett ansikte~ansiktet, ansikten|顔=かお
A1|n|eye|глаз|das Auge~die Augen|ett öga~ögat, ögon|目=め
A1|n|ear|ухо|das Ohr~die Ohren|ett öra~örat, öron|耳=みみ
A1|n|nose|нос|die Nase~die Nasen|en näsa~näsan, näsor|鼻=はな
A1|n|mouth|рот|der Mund~die Münder|en mun~munnen, munnar|口=くち
A2|n|tooth~teeth|зуб|der Zahn~die Zähne|en tand~tanden, tänder|歯=は
A1|n|hair|волосы|das Haar~die Haare|ett hår~håret, hår|髪=かみ
A1|n|hand|рука (кисть)|die Hand~die Hände|en hand~handen, händer|手=て
A1|n|arm|рука (от плеча)|der Arm~die Arme|en arm~armen, armar|腕=うで
A1|n|leg|нога|das Bein~die Beine|ett ben~benet, ben|脚=あし
A1|n|foot~feet|ступня|der Fuß~die Füße|en fot~foten, fötter|足=あし
A2|n|finger|палец|der Finger~die Finger|ett finger~fingret, fingrar|指=ゆび
A2|n|back|спина|der Rücken~die Rücken|en rygg~ryggen, ryggar|背中=せなか
A2|n|stomach|живот|der Bauch~die Bäuche|en mage~magen, magar|お腹=おなか
A2|n|heart|сердце|das Herz~die Herzen|ett hjärta~hjärtat, hjärtan|心臓=しんぞう
A2|n|neck|шея|der Hals~die Hälse|en hals~halsen, halsar|首=くび
A2|n|shoulder|плечо|die Schulter~die Schultern|en axel~axeln, axlar|肩=かた
A2|n|knee|колено|das Knie~die Knie|ett knä~knät, knän|膝=ひざ
B1|n|skin|кожа|die Haut~die Häute|en hud~huden|肌=はだ
B1|n|blood|кровь|das Blut|ett blod~blodet|血=ち
A1|n|doctor|врач|der Arzt~die Ärzte|en läkare~läkaren, läkare|医者=いしゃ
A2|n|hospital|больница|das Krankenhaus~die Krankenhäuser|ett sjukhus~sjukhuset, sjukhus|病院=びょういん
A2|n|pharmacy|аптека|die Apotheke~die Apotheken|ett apotek~apoteket, apotek|薬局=やっきょく
A2|n|medicine|лекарство|das Medikament~die Medikamente|en medicin~medicinen, mediciner|薬=くすり
A2|n|pain|боль|der Schmerz~die Schmerzen|en smärta~smärtan, smärtor|痛み=いたみ
A2|n|headache|головная боль|Kopfschmerzen (Pl.)|en huvudvärk~huvudvärken|頭痛=ずつう
A2|n|cold (illness)|простуда|die Erkältung~die Erkältungen|en förkylning~förkylningen, förkylningar|風邪=かぜ
A2|n|fever|температура, жар|das Fieber|en feber~febern|熱=ねつ
A1|a|ill, sick|больной|krank|sjuk~sjukt, sjuka|病気=びょうき
A1|a|healthy|здоровый|gesund|frisk~friskt, friska|元気=げんき
A2|a|tired|уставший|müde|trött~trött, trötta|疲れた=つかれた
A2|v|hurt|болеть (о части тела)|wehtun~tut weh, tat weh, hat wehgetan|göra ont~gör ont, gjorde ont, gjort ont|痛い=いたい
A2|v|rest|отдыхать|sich ausruhen~ruht sich aus, ruhte sich aus, hat sich ausgeruht|vila~vilar, vilade, vilat|休む=やすむ
B1|n|health|здоровье|die Gesundheit|en hälsa~hälsan|健康=けんこう
B1|n|ambulance|скорая помощь|der Krankenwagen~die Krankenwagen|en ambulans~ambulansen, ambulanser|救急車=きゅうきゅうしゃ
`,
  food: `
A1|n|food|еда|das Essen|en mat~maten|食べ物=たべもの
A1|n|bread|хлеб|das Brot~die Brote|ett bröd~brödet, bröd|パン
A1|n|butter|сливочное масло|die Butter|ett smör~smöret|バター
A1|n|cheese|сыр|der Käse~die Käse|en ost~osten, ostar|チーズ
A1|n|egg|яйцо|das Ei~die Eier|ett ägg~ägget, ägg|卵=たまご
A1|n|meat|мясо|das Fleisch|ett kött~köttet|肉=にく
A1|n|fish|рыба|der Fisch~die Fische|en fisk~fisken, fiskar|魚=さかな
A1|n|chicken (meat)|курица (мясо)|das Hähnchen~die Hähnchen|en kyckling~kycklingen, kycklingar|鶏肉=とりにく
A1|n|rice|рис|der Reis|ett ris~riset|ご飯=ごはん
A1|n|potato~potatoes|картофель|die Kartoffel~die Kartoffeln|en potatis~potatisen, potatisar|じゃがいも
A1|n|vegetables|овощи|das Gemüse|grönsaker (pl.)~grönsakerna|野菜=やさい
A1|n|fruit|фрукты|das Obst|en frukt~frukten, frukter|果物=くだもの
A1|n|apple|яблоко|der Apfel~die Äpfel|ett äpple~äpplet, äpplen|りんご
A1|n|banana|банан|die Banane~die Bananen|en banan~bananen, bananer|バナナ
A1|n|orange|апельсин|die Orange~die Orangen|en apelsin~apelsinen, apelsiner|オレンジ
A2|n|strawberry|клубника|die Erdbeere~die Erdbeeren|en jordgubbe~jordgubben, jordgubbar|いちご
A2|n|tomato~tomatoes|помидор|die Tomate~die Tomaten|en tomat~tomaten, tomater|トマト
A2|n|onion|лук|die Zwiebel~die Zwiebeln|en lök~löken, lökar|玉ねぎ=たまねぎ
A2|n|carrot|морковь|die Karotte~die Karotten|en morot~moroten, morötter|にんじん
A2|n|cucumber|огурец|die Gurke~die Gurken|en gurka~gurkan, gurkor|きゅうり
A1|n|salt|соль|das Salz|ett salt~saltet|塩=しお
A2|n|pepper|перец (специя)|der Pfeffer|en peppar~pepparn|胡椒=こしょう
A1|n|sugar|сахар|der Zucker|ett socker~sockret|砂糖=さとう
A1|n|soup|суп|die Suppe~die Suppen|en soppa~soppan, soppor|スープ
A2|n|salad|салат|der Salat~die Salate|en sallad~salladen, sallader|サラダ
A1|n|cake|торт, пирог|der Kuchen~die Kuchen|en tårta~tårtan, tårtor|ケーキ
A2|n|chocolate|шоколад|die Schokolade|en choklad~chokladen|チョコレート
A1|n|breakfast|завтрак|das Frühstück|en frukost~frukosten|朝ご飯=あさごはん
A1|n|lunch|обед|das Mittagessen|en lunch~lunchen|昼ご飯=ひるごはん
A1|n|dinner|ужин|das Abendessen|en middag~middagen|晩ご飯=ばんごはん
A2|n|pasta|макароны, паста|Nudeln (Pl.)|pasta~pastan|パスタ
A2|n|sausage|колбаса, сосиска|die Wurst~die Würste|en korv~korven, korvar|ソーセージ
A2|n|mushroom|гриб|der Pilz~die Pilze|en svamp~svampen, svampar|きのこ
A2|n|honey|мёд|der Honig|en honung~honungen|はちみつ
B1|n|flour|мука|das Mehl|ett mjöl~mjölet|小麦粉=こむぎこ
A1|v|eat~ate, eaten|есть, кушать|essen~isst, aß, hat gegessen|äta~äter, åt, ätit|食べる=たべる
A2|v|cook|готовить (еду)|kochen~kocht, kochte, hat gekocht|laga mat~lagar mat, lagade mat, lagat mat|料理する=りょうりする
A1|a|delicious|вкусный|lecker|god~gott, goda|美味しい=おいしい
A2|a|sweet|сладкий|süß|söt~sött, söta|甘い=あまい
A2|a|salty|солёный|salzig|salt~salt, salta|しょっぱい
A2|a|sour|кислый|sauer|sur~surt, sura|酸っぱい=すっぱい
A2|a|spicy|острый (о еде)|scharf|stark~starkt, starka|辛い=からい
A1|a|hungry|голодный|hungrig|hungrig~hungrigt, hungriga|お腹が空いた=おなかがすいた
`,
  drinks: `
A1|n|water|вода|das Wasser|ett vatten~vattnet|水=みず
A1|n|coffee|кофе|der Kaffee|ett kaffe~kaffet|コーヒー
A1|n|tea|чай|der Tee|ett te~teet|お茶=おちゃ
A1|n|milk|молоко|die Milch|en mjölk~mjölken|牛乳=ぎゅうにゅう
A1|n|juice|сок|der Saft~die Säfte|en juice~juicen|ジュース
A1|n|beer|пиво|das Bier~die Biere|en öl~ölen|ビール
A1|n|wine|вино|der Wein~die Weine|ett vin~vinet, viner|ワイン
A1|n|glass|стакан|das Glas~die Gläser|ett glas~glaset, glas|コップ
A1|n|cup|чашка|die Tasse~die Tassen|en kopp~koppen, koppar|カップ
A1|n|plate|тарелка|der Teller~die Teller|en tallrik~tallriken, tallrikar|皿=さら
A1|n|knife~knives|нож|das Messer~die Messer|en kniv~kniven, knivar|ナイフ
A1|n|fork|вилка|die Gabel~die Gabeln|en gaffel~gaffeln, gafflar|フォーク
A1|n|spoon|ложка|der Löffel~die Löffel|en sked~skeden, skedar|スプーン
A2|n|chopsticks|палочки для еды|Essstäbchen (Pl.)|ätpinnar (pl.)~ätpinnarna|箸=はし
A2|n|bottle|бутылка|die Flasche~die Flaschen|en flaska~flaskan, flaskor|瓶=びん
A2|n|pot, saucepan|кастрюля|der Topf~die Töpfe|en kastrull~kastrullen, kastruller|鍋=なべ
A2|n|frying pan|сковорода|die Pfanne~die Pfannen|en stekpanna~stekpannan, stekpannor|フライパン
A1|n|restaurant|ресторан|das Restaurant~die Restaurants|en restaurang~restaurangen, restauranger|レストラン
A1|n|café|кафе|das Café~die Cafés|ett kafé~kaféet, kaféer|喫茶店=きっさてん
A2|n|menu|меню|die Speisekarte~die Speisekarten|en meny~menyn, menyer|メニュー
A2|n|bill (in a restaurant)|счёт|die Rechnung~die Rechnungen|en nota~notan, notor|お会計=おかいけい
A2|n|waiter|официант|der Kellner~die Kellner|en servitör~servitören, servitörer|ウェイター
A1|v|drink~drank, drunk|пить|trinken~trinkt, trank, hat getrunken|dricka~dricker, drack, druckit|飲む=のむ
A1|a|thirsty|испытывающий жажду|durstig|törstig~törstigt, törstiga|喉が渇いた=のどがかわいた
A2|a|hot (to the touch)|горячий|heiß|het~hett, heta|熱い=あつい
A2|a|cold (to the touch)|холодный (на ощупь)|kalt|kall~kallt, kalla|冷たい=つめたい
A2|v|order|заказывать|bestellen~bestellt, bestellte, hat bestellt|beställa~beställer, beställde, beställt|注文する=ちゅうもんする
`,
};
