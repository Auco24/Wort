// Format: level|pos|en|ru|de|sv|ja — see words1.ts
export const WORDS_4: Record<string, string> = {
  emotions: `
A1|a|happy|счастливый, радостный|glücklich|glad~glatt, glada|嬉しい=うれしい
A1|a|sad|грустный|traurig|ledsen~ledset, ledsna|悲しい=かなしい
A2|a|angry|злой, сердитый|wütend|arg~argt, arga|怒っている=おこっている
A2|a|afraid|испуганный|ängstlich|rädd~rädd, rädda|怖い=こわい
A2|a|nervous|нервный, взволнованный|nervös|nervös~nervöst, nervösa|緊張している=きんちょうしている
A2|a|bored|скучающий|gelangweilt|uttråkad~uttråkat, uttråkade|退屈=たいくつ
A2|a|surprised|удивлённый|überrascht|förvånad~förvånat, förvånade|驚いた=おどろいた
A2|a|calm|спокойный|ruhig|lugn~lugnt, lugna|落ち着いた=おちついた
A2|a|kind|добрый|nett|snäll~snällt, snälla|優しい=やさしい
A2|a|friendly|дружелюбный|freundlich|vänlig~vänligt, vänliga|親切=しんせつ
B1|a|polite|вежливый|höflich|artig~artigt, artiga|丁寧=ていねい
B1|a|honest|честный|ehrlich|ärlig~ärligt, ärliga|正直=しょうじき
B1|a|lazy|ленивый|faul|lat~lat, lata|怠け者=なまけもの
B1|a|shy|застенчивый|schüchtern|blyg~blygt, blyga|恥ずかしがり屋=はずかしがりや
B1|a|proud|гордый|stolz|stolt~stolt, stolta|誇らしい=ほこらしい
B1|a|patient|терпеливый|geduldig|tålmodig~tålmodigt, tålmodiga|我慢強い=がまんづよい
B1|a|curious|любопытный|neugierig|nyfiken~nyfiket, nyfikna|好奇心旺盛=こうきしんおうせい
A2|a|funny|смешной, забавный|lustig|rolig~roligt, roliga|面白い=おもしろい
A2|a|clever|умный|klug|smart~smart, smarta|頭がいい=あたまがいい
A1|n|love|любовь|die Liebe|en kärlek~kärleken|愛=あい
A2|n|fear|страх|die Angst~die Ängste|en rädsla~rädslan, rädslor|恐怖=きょうふ
A2|n|joy|радость|die Freude~die Freuden|en glädje~glädjen|喜び=よろこび
B1|n|feeling|чувство|das Gefühl~die Gefühle|en känsla~känslan, känslor|気持ち=きもち
B1|n|hope|надежда|die Hoffnung~die Hoffnungen|ett hopp~hoppet|希望=きぼう
B1|n|anger|гнев, злость|die Wut|en ilska~ilskan|怒り=いかり
A1|v|love|любить|lieben~liebt, liebte, hat geliebt|älska~älskar, älskade, älskat|愛する=あいする
A1|v|like|нравиться, любить|mögen~mag, mochte, hat gemocht|tycka om~tycker om, tyckte om, tyckt om|好き=すき
A2|v|hate|ненавидеть|hassen~hasst, hasste, hat gehasst|hata~hatar, hatade, hatat|嫌い=きらい
A2|v|laugh|смеяться|lachen~lacht, lachte, hat gelacht|skratta~skrattar, skrattade, skrattat|笑う=わらう
A2|v|cry|плакать|weinen~weint, weinte, hat geweint|gråta~gråter, grät, gråtit|泣く=なく
B1|v|worry|беспокоиться|sich Sorgen machen|oroa sig~oroar sig, oroade sig, oroat sig|心配する=しんぱいする
B1|v|hope|надеяться|hoffen~hofft, hoffte, hat gehofft|hoppas~hoppas, hoppades, hoppats|願う=ねがう
`,
  hobbies: `
A1|n|hobby~hobbies|хобби|das Hobby~die Hobbys|en hobby~hobbyn, hobbyer|趣味=しゅみ
A1|n|music|музыка|die Musik|en musik~musiken|音楽=おんがく
A2|n|song|песня|das Lied~die Lieder|en sång~sången, sånger|歌=うた
A1|n|film, movie|фильм|der Film~die Filme|en film~filmen, filmer|映画=えいが
A2|n|cinema|кинотеатр|das Kino~die Kinos|en bio~bion|映画館=えいがかん
A2|n|theatre|театр|das Theater~die Theater|en teater~teatern, teatrar|劇場=げきじょう
A2|n|game|игра|das Spiel~die Spiele|ett spel~spelet, spel|ゲーム
A1|n|sport|спорт|der Sport|en sport~sporten, sporter|スポーツ
A2|n|football|футбол|der Fußball|en fotboll~fotbollen|サッカー
A2|n|ball|мяч|der Ball~die Bälle|en boll~bollen, bollar|ボール
A2|n|team|команда|die Mannschaft~die Mannschaften|ett lag~laget, lag|チーム
A2|n|photo|фотография|das Foto~die Fotos|ett foto~fotot, foton|写真=しゃしん
A2|n|picture, painting|картина|das Bild~die Bilder|en tavla~tavlan, tavlor|絵=え
A2|n|guitar|гитара|die Gitarre~die Gitarren|en gitarr~gitarren, gitarrer|ギター
A2|n|party~parties|вечеринка|die Party~die Partys|en fest~festen, fester|パーティー
B1|n|concert|концерт|das Konzert~die Konzerte|en konsert~konserten, konserter|コンサート
A2|n|swimming pool|бассейн|das Schwimmbad~die Schwimmbäder|en simhall~simhallen, simhallar|プール
A2|n|free time|свободное время|die Freizeit|en fritid~fritiden|暇=ひま
A1|v|play|играть|spielen~spielt, spielte, hat gespielt|spela~spelar, spelade, spelat|遊ぶ=あそぶ
A1|v|sing~sang, sung|петь|singen~singt, sang, hat gesungen|sjunga~sjunger, sjöng, sjungit|歌う=うたう
A2|v|dance|танцевать|tanzen~tanzt, tanzte, hat getanzt|dansa~dansar, dansade, dansat|踊る=おどる
A2|v|swim~swam, swum|плавать|schwimmen~schwimmt, schwamm, ist geschwommen|simma~simmar, simmade, simmat|泳ぐ=およぐ
A2|v|run~ran, run|бегать|laufen~läuft, lief, ist gelaufen|springa~springer, sprang, sprungit|走る=はしる
A2|v|draw~drew, drawn|рисовать|zeichnen~zeichnet, zeichnete, hat gezeichnet|rita~ritar, ritade, ritat|描く=かく
A2|v|go for a walk|гулять|spazieren gehen~geht spazieren, ging spazieren, ist spazieren gegangen|promenera~promenerar, promenerade, promenerat|散歩する=さんぽする
A2|v|win~won, won|побеждать, выигрывать|gewinnen~gewinnt, gewann, hat gewonnen|vinna~vinner, vann, vunnit|勝つ=かつ
B1|v|lose~lost, lost|проигрывать|verlieren~verliert, verlor, hat verloren|förlora~förlorar, förlorade, förlorat|負ける=まける
A2|v|listen|слушать|hören~hört, hörte, hat gehört|lyssna~lyssnar, lyssnade, lyssnat|聞く=きく
A1|v|watch|смотреть (фильм, ТВ)|ansehen~sieht an, sah an, hat angesehen|titta~tittar, tittade, tittat|観る=みる
`,
  tech: `
A1|n|telephone|телефон|das Telefon~die Telefone|en telefon~telefonen, telefoner|電話=でんわ
A2|n|mobile phone|мобильный телефон|das Handy~die Handys|en mobil~mobilen, mobiler|携帯電話=けいたいでんわ
A1|n|computer|компьютер|der Computer~die Computer|en dator~datorn, datorer|パソコン
A2|n|internet|интернет|das Internet|internet|インターネット
A2|n|email|электронное письмо|die E-Mail~die E-Mails|ett mejl~mejlet, mejl|メール
A1|n|letter|письмо|der Brief~die Briefe|ett brev~brevet, brev|手紙=てがみ
A2|n|message|сообщение|die Nachricht~die Nachrichten|ett meddelande~meddelandet, meddelanden|メッセージ
A2|n|password|пароль|das Passwort~die Passwörter|ett lösenord~lösenordet, lösenord|パスワード
A2|n|screen|экран|der Bildschirm~die Bildschirme|en skärm~skärmen, skärmar|画面=がめん
A2|n|keyboard|клавиатура|die Tastatur~die Tastaturen|ett tangentbord~tangentbordet, tangentbord|キーボード
B1|n|website|сайт|die Webseite~die Webseiten|en webbplats~webbplatsen, webbplatser|ウェブサイト
B1|n|app|приложение|die App~die Apps|en app~appen, appar|アプリ
B1|n|file|файл|die Datei~die Dateien|en fil~filen, filer|ファイル
A2|n|newspaper|газета|die Zeitung~die Zeitungen|en tidning~tidningen, tidningar|新聞=しんぶん
A2|n|television|телевизор|der Fernseher~die Fernseher|en tv~tv:n|テレビ
A2|n|news|новости|Nachrichten (Pl.)|nyheter (pl.)~nyheterna|ニュース
B1|n|battery~batteries|аккумулятор, батарейка|der Akku~die Akkus|ett batteri~batteriet, batterier|電池=でんち
A1|v|call|звонить|anrufen~ruft an, rief an, hat angerufen|ringa~ringer, ringde, ringt|電話する=でんわする
A2|v|send~sent, sent|отправлять|schicken~schickt, schickte, hat geschickt|skicka~skickar, skickade, skickat|送る=おくる
A2|v|receive|получать|bekommen~bekommt, bekam, hat bekommen|få~får, fick, fått|受け取る=うけとる
B1|v|download|скачивать|herunterladen~lädt herunter, lud herunter, hat heruntergeladen|ladda ner~laddar ner, laddade ner, laddat ner|ダウンロードする
B1|v|save (a file)|сохранять|speichern~speichert, speicherte, hat gespeichert|spara~sparar, sparade, sparat|保存する=ほぞんする
B1|v|delete|удалять|löschen~löscht, löschte, hat gelöscht|radera~raderar, raderade, raderat|削除する=さくじょする
`,
  verbs: `
A1|v:en,de,sv|be~was/were, been|быть|sein~ist, war, ist gewesen|vara~är, var, varit|-
A1|v|have~had, had|иметь|haben~hat, hatte, hat gehabt|ha~har, hade, haft|持つ=もつ
A1|v|do~did, done|делать|machen~macht, machte, hat gemacht|göra~gör, gjorde, gjort|する
A1|v|come~came, come|приходить|kommen~kommt, kam, ist gekommen|komma~kommer, kom, kommit|来る=くる
A1|v|see~saw, seen|видеть|sehen~sieht, sah, hat gesehen|se~ser, såg, sett|見る=みる
A1|v|say~said, said|сказать, говорить|sagen~sagt, sagte, hat gesagt|säga~säger, sa, sagt|言う=いう
A1|v|speak~spoke, spoken|говорить (на языке)|sprechen~spricht, sprach, hat gesprochen|prata~pratar, pratade, pratat|話す=はなす
A1|v|give~gave, given|давать|geben~gibt, gab, hat gegeben|ge~ger, gav, gett|あげる
A1|v|take~took, taken|брать|nehmen~nimmt, nahm, hat genommen|ta~tar, tog, tagit|取る=とる
A1|v|know~knew, known|знать|wissen~weiß, wusste, hat gewusst|veta~vet, visste, vetat|知る=しる
A1|v|think~thought, thought|думать|denken~denkt, dachte, hat gedacht|tänka~tänker, tänkte, tänkt|思う=おもう
A1|v|want|хотеть|wollen~will, wollte, hat gewollt|vilja~vill, ville, velat|欲しい=ほしい
A1|v|can~could|мочь, уметь|können~kann, konnte, hat gekonnt|kunna~kan, kunde, kunnat|できる
A1|v:en,de,sv|must|быть должным|müssen~muss, musste, hat gemusst|måste~måste, måste, måst|-
A1|v|find~found, found|находить|finden~findet, fand, hat gefunden|hitta~hittar, hittade, hittat|見つける=みつける
A1|v|look for|искать|suchen~sucht, suchte, hat gesucht|leta~letar, letade, letat|探す=さがす
A1|v|wait|ждать|warten~wartet, wartete, hat gewartet|vänta~väntar, väntade, väntat|待つ=まつ
A1|v|help|помогать|helfen~hilft, half, hat geholfen|hjälpa~hjälper, hjälpte, hjälpt|手伝う=てつだう
A1|v|ask|спрашивать|fragen~fragt, fragte, hat gefragt|fråga~frågar, frågade, frågat|尋ねる=たずねる
A1|v|answer|отвечать|antworten~antwortet, antwortete, hat geantwortet|svara~svarar, svarade, svarat|答える=こたえる
A1|v|begin~began, begun|начинать|beginnen~beginnt, begann, hat begonnen|börja~börjar, började, börjat|始める=はじめる
A1|v|finish|заканчивать(ся)|beenden~beendet, beendete, hat beendet|sluta~slutar, slutade, slutat|終わる=おわる
A1|v|stand~stood, stood|стоять|stehen~steht, stand, hat gestanden|stå~står, stod, stått|立つ=たつ
A1|v|sit~sat, sat|сидеть|sitzen~sitzt, saß, hat gesessen|sitta~sitter, satt, suttit|座る=すわる
A2|v|lie~lay, lain|лежать|liegen~liegt, lag, hat gelegen|ligga~ligger, låg, legat|横になる=よこになる
A1|v|put~put, put|класть|legen~legt, legte, hat gelegt|lägga~lägger, lade, lagt|置く=おく
A2|v|bring~brought, brought|приносить|bringen~bringt, brachte, hat gebracht|ta med~tar med, tog med, tagit med|持ってくる=もってくる
A2|v|use|использовать|benutzen~benutzt, benutzte, hat benutzt|använda~använder, använde, använt|使う=つかう
A2|v|show|показывать|zeigen~zeigt, zeigte, hat gezeigt|visa~visar, visade, visat|見せる=みせる
A2|v|believe|верить|glauben~glaubt, glaubte, hat geglaubt|tro~tror, trodde, trott|信じる=しんじる
A2|v|try|пробовать, пытаться|versuchen~versucht, versuchte, hat versucht|försöka~försöker, försökte, försökt|試す=ためす
A2|v|need|нуждаться, нужно|brauchen~braucht, brauchte, hat gebraucht|behöva~behöver, behövde, behövt|必要だ=ひつようだ
A2|v|live|жить|leben~lebt, lebte, hat gelebt|leva~lever, levde, levt|生きる=いきる
A2|v|die|умирать|sterben~stirbt, starb, ist gestorben|dö~dör, dog, dött|死ぬ=しぬ
A2|v|meet~met, met|встречать(ся)|treffen~trifft, traf, hat getroffen|träffa~träffar, träffade, träffat|会う=あう
A2|v|leave~left, left|уходить, покидать|verlassen~verlässt, verließ, hat verlassen|lämna~lämnar, lämnade, lämnat|出る=でる
A2|v|stay|оставаться|bleiben~bleibt, blieb, ist geblieben|stanna~stannar, stannade, stannat|残る=のこる
A2|v|change|менять|ändern~ändert, änderte, hat geändert|ändra~ändrar, ändrade, ändrat|変える=かえる
A2|v|fall~fell, fallen|падать|fallen~fällt, fiel, ist gefallen|falla~faller, föll, fallit|落ちる=おちる
A2|v|break~broke, broken|ломать|brechen~bricht, brach, hat gebrochen|bryta~bryter, bröt, brutit|壊す=こわす
B1|v|decide|решать|entscheiden~entscheidet, entschied, hat entschieden|bestämma~bestämmer, bestämde, bestämt|決める=きめる
B1|v|allow|разрешать|erlauben~erlaubt, erlaubte, hat erlaubt|tillåta~tillåter, tillät, tillåtit|許す=ゆるす
B1|v|happen|случаться|passieren~passiert, passierte, ist passiert|hända~händer, hände, hänt|起こる=おこる
B1|v|choose~chose, chosen|выбирать|wählen~wählt, wählte, hat gewählt|välja~väljer, valde, valt|選ぶ=えらぶ
B1|v|prepare|готовить, подготавливать|vorbereiten~bereitet vor, bereitete vor, hat vorbereitet|förbereda~förbereder, förberedde, förberett|準備する=じゅんびする
B1|v|compare|сравнивать|vergleichen~vergleicht, verglich, hat verglichen|jämföra~jämför, jämförde, jämfört|比べる=くらべる
B1|v|develop|развивать|entwickeln~entwickelt, entwickelte, hat entwickelt|utveckla~utvecklar, utvecklade, utvecklat|開発する=かいはつする
B1|v|agree|соглашаться|zustimmen~stimmt zu, stimmte zu, hat zugestimmt|hålla med~håller med, höll med, hållit med|賛成する=さんせいする
B1|v|promise|обещать|versprechen~verspricht, versprach, hat versprochen|lova~lovar, lovade, lovat|約束する=やくそくする
B1|v|succeed|добиться успеха|Erfolg haben|lyckas~lyckas, lyckades, lyckats|成功する=せいこうする
`,
  adjectives: `
A1|a|big|большой|groß|stor~stort, stora|大きい=おおきい
A1|a|small|маленький|klein|liten~litet, små|小さい=ちいさい
A1|a|good~better, best|хороший|gut|bra~bättre, bäst|良い=よい
A1|a|bad~worse, worst|плохой|schlecht|dålig~dåligt, dåliga|悪い=わるい
A1|a|new|новый|neu|ny~nytt, nya|新しい=あたらしい
A1|a|old (thing)|старый (о вещах)|alt|gammal~gammalt, gamla|古い=ふるい
A1|a|beautiful|красивый|schön|vacker~vackert, vackra|綺麗=きれい
A2|a|ugly|некрасивый, уродливый|hässlich|ful~fult, fula|醜い=みにくい
A1|a|long|длинный|lang|lång~långt, långa|長い=ながい
A1|a|short|короткий|kurz|kort~kort, korta|短い=みじかい
A1|a|fast|быстрый|schnell|snabb~snabbt, snabba|速い=はやい
A1|a|slow|медленный|langsam|långsam~långsamt, långsamma|遅い=おそい
A1|a|easy|лёгкий, простой|einfach|enkel~enkelt, enkla|簡単=かんたん
A1|a|difficult|трудный|schwierig|svår~svårt, svåra|難しい=むずかしい
A2|a|heavy|тяжёлый|schwer|tung~tungt, tunga|重い=おもい
A2|a|light (weight)|лёгкий (по весу)|leicht|lätt~lätt, lätta|軽い=かるい
A1|a|important|важный|wichtig|viktig~viktigt, viktiga|大切=たいせつ
A2|a|interesting|интересный|interessant|intressant~intressant, intressanta|興味深い=きょうみぶかい
A2|a|boring|скучный|langweilig|tråkig~tråkigt, tråkiga|つまらない
A1|a|right, correct|правильный|richtig|rätt|正しい=ただしい
A1|a|wrong|неправильный|falsch|fel|間違った=まちがった
A2|a|full|полный|voll|full~fullt, fulla|いっぱい
A2|a|empty|пустой|leer|tom~tomt, tomma|空=から
A2|a|clean|чистый|sauber|ren~rent, rena|清潔=せいけつ
A2|a|dirty|грязный|schmutzig|smutsig~smutsigt, smutsiga|汚い=きたない
A2|a|quiet|тихий|leise|tyst~tyst, tysta|静か=しずか
A2|a|loud, noisy|громкий, шумный|laut|högljudd~högljutt, högljudda|うるさい
A2|a|rich|богатый|reich|rik~rikt, rika|金持ち=かねもち
A2|a|poor|бедный|arm|fattig~fattigt, fattiga|貧しい=まずしい
A2|a|strong|сильный|stark|stark~starkt, starka|強い=つよい
A2|a|weak|слабый|schwach|svag~svagt, svaga|弱い=よわい
A2|a:en,de,sv|high, tall|высокий|hoch|hög~högt, höga|高い=たかい
A2|a|low|низкий|niedrig|låg~lågt, låga|低い=ひくい
A2|a|wide|широкий|breit|bred~brett, breda|広い=ひろい
A2|a|narrow|узкий|eng|smal~smalt, smala|狭い=せまい
B1|a|dangerous|опасный|gefährlich|farlig~farligt, farliga|危ない=あぶない
B1|a|safe|безопасный|sicher|säker~säkert, säkra|安全=あんぜん
B1|a|possible|возможный|möglich|möjlig~möjligt, möjliga|可能=かのう
B1|a|necessary|необходимый|notwendig|nödvändig~nödvändigt, nödvändiga|必要=ひつよう
B1|a|similar|похожий|ähnlich|lik~likt, lika|似ている=にている
B1|a|different|разный, другой|verschieden|olik~olikt, olika|違う=ちがう
B1|a|famous|известный|berühmt|känd~känt, kända|有名=ゆうめい
B1|a|strange|странный|seltsam|konstig~konstigt, konstiga|変=へん
B1|a|true|правдивый, верный|wahr|sann~sant, sanna|本当=ほんとう
B1|a:en,de,sv|free (not busy)|свободный|frei|ledig~ledigt, lediga|-
A2|a|ready|готовый|fertig|klar~klart, klara|準備ができた=じゅんびができた
A2|a|soft|мягкий|weich|mjuk~mjukt, mjuka|柔らかい=やわらかい
A2|a|hard|твёрдый|hart|hård~hårt, hårda|硬い=かたい
`,
  society: `
B1|n|society~societies|общество|die Gesellschaft~die Gesellschaften|ett samhälle~samhället, samhällen|社会=しゃかい
B1|n|government|правительство|die Regierung~die Regierungen|en regering~regeringen, regeringar|政府=せいふ
B1|n|politics|политика|die Politik|en politik~politiken|政治=せいじ
B1|n|law|закон|das Gesetz~die Gesetze|en lag~lagen, lagar|法律=ほうりつ
B1|n|election|выборы|die Wahl~die Wahlen|ett val~valet, val|選挙=せんきょ
B1|n|war|война|der Krieg~die Kriege|ett krig~kriget, krig|戦争=せんそう
B1|n|peace|мир (отсутствие войны)|der Frieden|en fred~freden|平和=へいわ
B1|n|freedom|свобода|die Freiheit~die Freiheiten|en frihet~friheten, friheter|自由=じゆう
B1|n|right (legal)|право|das Recht~die Rechte|en rättighet~rättigheten, rättigheter|権利=けんり
B1|n|problem|проблема|das Problem~die Probleme|ett problem~problemet, problem|問題=もんだい
B1|n|solution|решение|die Lösung~die Lösungen|en lösning~lösningen, lösningar|解決=かいけつ
B1|n|opinion|мнение|die Meinung~die Meinungen|en åsikt~åsikten, åsikter|意見=いけん
B1|n|reason|причина|der Grund~die Gründe|en anledning~anledningen, anledningar|理由=りゆう
B1|n|result|результат|das Ergebnis~die Ergebnisse|ett resultat~resultatet, resultat|結果=けっか
B1|n|goal|цель|das Ziel~die Ziele|ett mål~målet, mål|目標=もくひょう
B1|n|idea|идея|die Idee~die Ideen|en idé~idén, idéer|アイデア
B1|n|history|история|die Geschichte~die Geschichten|en historia~historien, historier|歴史=れきし
B1|n|culture|культура|die Kultur~die Kulturen|en kultur~kulturen, kulturer|文化=ぶんか
B1|n|religion|религия|die Religion~die Religionen|en religion~religionen, religioner|宗教=しゅうきょう
B1|n|economy|экономика|die Wirtschaft|en ekonomi~ekonomin|経済=けいざい
B1|n|population|население|die Bevölkerung|en befolkning~befolkningen|人口=じんこう
B1|n|citizen|гражданин|der Bürger~die Bürger|en medborgare~medborgaren, medborgare|市民=しみん
B2|n|development|развитие|die Entwicklung~die Entwicklungen|en utveckling~utvecklingen, utvecklingar|発展=はってん
B2|n|research|исследование|die Forschung~die Forschungen|en forskning~forskningen|研究=けんきゅう
B2|n|science|наука|die Wissenschaft~die Wissenschaften|en vetenskap~vetenskapen, vetenskaper|科学=かがく
B2|n|responsibility|ответственность|die Verantwortung|ett ansvar~ansvaret|責任=せきにん
B2|n|advantage|преимущество|der Vorteil~die Vorteile|en fördel~fördelen, fördelar|利点=りてん
B2|n|disadvantage|недостаток|der Nachteil~die Nachteile|en nackdel~nackdelen, nackdelar|欠点=けってん
B2|n|condition|условие|die Bedingung~die Bedingungen|ett villkor~villkoret, villkor|条件=じょうけん
B2|n|influence|влияние|der Einfluss~die Einflüsse|ett inflytande~inflytandet|影響=えいきょう
B2|n|attempt|попытка|der Versuch~die Versuche|ett försök~försöket, försök|試み=こころみ
B2|n|relationship|отношения|die Beziehung~die Beziehungen|ett förhållande~förhållandet, förhållanden|関係=かんけい
B2|n|equality|равенство|die Gleichheit|en jämlikhet~jämlikheten|平等=びょうどう
B2|n|crime|преступление|das Verbrechen~die Verbrechen|ett brott~brottet, brott|犯罪=はんざい
B2|n|evidence|доказательство|der Beweis~die Beweise|ett bevis~beviset, bevis|証拠=しょうこ
B2|v|discuss|обсуждать|diskutieren~diskutiert, diskutierte, hat diskutiert|diskutera~diskuterar, diskuterade, diskuterat|話し合う=はなしあう
B2|v|claim|утверждать|behaupten~behauptet, behauptete, hat behauptet|påstå~påstår, påstod, påstått|主張する=しゅちょうする
B2|v|support|поддерживать|unterstützen~unterstützt, unterstützte, hat unterstützt|stödja~stödjer, stödde, stött|支える=ささえる
B2|v|avoid|избегать|vermeiden~vermeidet, vermied, hat vermieden|undvika~undviker, undvek, undvikit|避ける=さける
B2|v|increase|увеличиваться, расти|steigen~steigt, stieg, ist gestiegen|öka~ökar, ökade, ökat|増える=ふえる
B2|v|decrease|уменьшаться|sinken~sinkt, sank, ist gesunken|minska~minskar, minskade, minskat|減る=へる
B2|v|require|требовать|erfordern~erfordert, erforderte, hat erfordert|kräva~kräver, krävde, krävt|必要とする=ひつようとする
B2|v|achieve|достигать|erreichen~erreicht, erreichte, hat erreicht|uppnå~uppnår, uppnådde, uppnått|達成する=たっせいする
B2|v|improve|улучшать|verbessern~verbessert, verbesserte, hat verbessert|förbättra~förbättrar, förbättrade, förbättrat|改善する=かいぜんする
B2|v|consider|обдумывать, рассматривать|überlegen~überlegt, überlegte, hat überlegt|överväga~överväger, övervägde, övervägt|考える=かんがえる
B2|a|obvious|очевидный|offensichtlich|uppenbar~uppenbart, uppenbara|明らか=あきらか
B2|a|reliable|надёжный|zuverlässig|pålitlig~pålitligt, pålitliga|信頼できる=しんらいできる
B2|a|significant|значительный, важный|bedeutend|betydande|重要=じゅうよう
B2|a|independent|независимый|unabhängig|oberoende|独立した=どくりつした
B2|a|available|доступный|verfügbar|tillgänglig~tillgängligt, tillgängliga|利用できる=りようできる
B2|d|however|однако|jedoch|dock|しかし
B2|d|therefore|поэтому|deshalb|därför|だから
B2|o|although|хотя|obwohl|fastän|けれども
B2|d|probably|вероятно|wahrscheinlich|förmodligen|たぶん
B2|d|especially|особенно|besonders|särskilt|特に=とくに
B2|d|actually|на самом деле|eigentlich|faktiskt|実は=じつは
B2|d|suddenly|вдруг|plötzlich|plötsligt|突然=とつぜん
B2|d|finally|наконец|endlich|äntligen|やっと
`,
};
