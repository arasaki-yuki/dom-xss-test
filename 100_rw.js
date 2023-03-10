/*
 @license
 https://gist.github.com/paulirish/1579671
 requestAnimationFrame polyfill by Erik Möller. Fixes from Paul Irish, Tino Zijdel
 MIT license
 @license
 Layzr.js 2.2.1 - A small, fast, and modern library for lazy loading images.
 Copyright (c) 2016 Michael Cavalea - http://callmecavs.github.io/layzr.js/
 License: MIT
 @license
 JavaScript MD5 - https://github.com/blueimp/JavaScript-MD5
 Copyright 2011, Sebastian Tschan - https://blueimp.net
 License: MIT
 @license
 https://github.com/remy/polyfills
 MIT license
*/
(function(d) {
    var BASE_URL = "//stg-widgets.taxel.jp"
      , TAG_URL = "/article.json"
      , CLICK_URL = "/click"
      , INVIEW_URL = "/l.gif"
      , WLOG_URL = "/wlog"
      , NOT_FOUND_URL = "/not_found"
      , MISSING_ADS_URL = "/missing_ads"
      , REQUEST_ID_COOKIE_NAME = "GMORW_RID"
      , FIRST_COOKIE_ID_COOKIE_NAME = "GMORW_UID"
      , PATTERN_ID_COOKIE_NAME = "GMORW_PTN_"
      , SESSION_COOKIE_NAME = "GMORW_SID_"
      , GMOSSP_XID_NAME = "gmoam_xid"
      , AKANE_FQ_COOKIE_NAME = "TAXEL_AK_FQ"
      , GMOSSP_DOMAIN = "sp.gmossp-sp.jp"
      , GMOSSP_BEACON_DOMAIN = "beacon.sp.gmossp-sp.jp"
      , GMOSSP_REDIRECT_DOMAIN_PATH = /sp\.gmossp-sp\.jp\/ads\/fw\.ad/
      , REQUEST_EXPIRE_SECOND = 15
      , FIRST_COOKIE_ID_EXPIRE_SECOND = 180 * 24 * 60 * 60
      , PATTERN_ID_EXPIRE_SECOND = 30 * 24 * 60 * 60
      , SESSION_EXPIRE_SECOND = 30 * 60
      , AKANE_FQ_EXPIRE_SECOND = 90 * 24 * 60 * 60
      , SSPAPI = "//" + GMOSSP_DOMAIN + "/ads/ssp.ad"
      , SSPFILLERAPI = "//" + GMOSSP_BEACON_DOMAIN + "/ads/filler.ad"
      , DOKURYOJS = "https://dokuryojs-prd.sp.gmossp-sp.jp/js/v2/gmo-am-reading.js"
      , MOMENTUMJS = "//assets-momentum.akamaized.net/js/axss.js"
      , PREVIEW_QUERY_STRING = "rpvw"
      , ABTEST_PREVIEW_QUERY_STRING = "abtestpreviewid"
      , RANDOM_QUERY_STRING = "txrnd"
      , OPTIONAL_QUERY_STRING = "opt"
      , LEAD_ARTICLE_IDS_QUERY_STRING = "laid"
      , DUMMY_MEDIA_ID = "0"
      , DUMMY_WIDGET_ID = "0"
      , TAXEL_POLICY = "https://taxel.media/policy/optout.html"
      , AB_TEST_PARENT = Math.random().toString(36).slice(-8)
      , TAXEL_SC_CLZ = "taxel-script"
      , TAXEL_ADS_CLZ = "taxel-adsense"
      , TAXEL_IF_CLZ = "taxel-ad-frame"
      , TAXEL_IF_ID = "taxel-iframe"
      , TAXEL_AD_MOVIE_CT_ID = "taxel-ad-movie-content"
      , TAXEL_ARTICLE_NOT_EXISTS_ID = "taxel_article_not_exists"
      , MAX_IF_TIMER_RUN = 120
      , IF_TIMEOUT = 250
      , gmoArticleIdRule = parseInt("1")
      , urlReplaceRules = JSON.parse("{}")
      , ampRefererReplaceRules = JSON.parse("{\"[?].*\": \"\", \"(http://|https://).+ampproject.org/.{1}/(s/)*\": \"$1\"}")
      , mediaId = "100"
      , crawlRule = JSON.parse("{\"image\": {\"tag\": \"meta[property='og:image']\", \"attr\": \"content\", \"required\": \"true\"}, \"title\": {\"tag\": \"meta[property='og:title']\", \"attr\": \"content\", \"regex\": \"ï¼æäºãããã³ã \"}, \"publicDate\": {\"tag\": \".ArticleTitleData\", \"regex\": \"\\\\d{4}.\\\\d?\\\\d.\\\\d?\\\\d.\", \"format\": \"yyyyå¹´MMæddæ¥\"}}")
      , INVIEW_PIXEL_NUM = 225
      , ADMOVIE_NEAR_INVIEW_PIXEL_NUM = window.innerHeight
      , TAXEL_SCRIPT_NEAR_INVIEW_PX = ADMOVIE_NEAR_INVIEW_PIXEL_NUM * 2
      , ENABLE_NEAR_INVIEW_LOAD_WIDGET_IDS = JSON.parse("[]")
      , VIEWABLE_SEC = 2
      , AD_NEWSTV = 30
      , AD_APPVADOR = 32
      , AD_RELAIDO = 34
      , AD_AMOADMAX = 6
      , AD_IMOBILE = "11"
      , AD_YDA = "15"
      , AD_CRITEO = "1010"
      , AD_UNKNOWN = "9999"
      , AD_CRITEO_CLASS = "_taxel_ad_type_criteo"
      , AD_DSP_CLASS = "_taxel_ad_type_dsp"
      , LOWER_DSP_NUM = 1001
      , UPPER_DSP_NUM = 1999
      , DFP_FRIENDLY_IFRAME = 1
      , DFP_AMP_SAFE_FRAME_FIXED_SIZE = 2
      , COOKIE_SYNC_REEMO_TO_GOOGLE_URL = "https://js.dsp.reemo-ad.jp/html/sync.html"
      , COOKIE_SYNC_GMOSSP_TO_DSP_DOMAIN = "cdn.sp.gmossp-sp.jp"
      , COOKIE_SYNC_GMOSSP_TO_DSP_URL = "https://cdn.sp.gmossp-sp.jp/view/gmossp_sync.html"
      , LEAD_ARTICLE_IDS_COOKIE_NAME = "TAXEL_LEAD_ARTICLE_IDS"
      , LEAD_ARTICLE_CACHE_NUM = parseInt("5")
      , LEAD_ARTICLE_IDS_COOKIE_EXPIRE_SECOND = 60 * 60
      , USE_CRITEO_DIRECT_BIDDER = parseInt("1")
      , CRITEO_CPM_RANGE = "5..1000:1;1000..5000:10"
      , C_TYPE_NATIVE = 1
      , C_TYPE_MOVIE = 2
      , validMedia = "1"
      , widgetIds = JSON.parse("[8476,9085,9133,14212]")
      , IM_UID_JS = "https://dmp.im-apps.net/scripts/im-uid-hook.js?cid\x3d1000283"
      , IM_UID_COOKIE_NAME = "_im_uid.1000283"
      , BOUNCE_INSERT_TYPE_INDEX = 0
      , BOUNCE_INSERT_TYPE_STAY_RATE = 1
      , INSERT_EMPTY_RW = 0
      , INSERT_RW_USE_HANDLERS_BAR = 1
      , INSERT_BOUNCE_POS_RECOMMEND = 2
      , INSERT_OTHER_RW = 3
      , WLOG_STATUS_ERROR = 9999
      , WLOG_STATUS_BLANK = 1
      , SP_WIDGET_IDS = JSON.parse("[8476,9085,9133,14212]")
      , PC_WIDGET_IDS = JSON.parse("[8476,9085,9133,14212]")
      , DATA_IMAGE_TYPE = "data-image-type"
      , DAMMY_CLICK_URL = "TAXEL_DAMMY_CLICK_URL"
      , CRITEO_REQUESTED_WIDGET_IDS = [];
    var __ = {};
    var topics = "";
    var receivedTopicsMessage = false;
    var isChrome = false;
    var gLogFrame;
    var gBeacons = [];
    var Ids = [];
    var timer;
    var createdBeaconType1FlagMap = {};
    var beaconNumberForWidget = {};
    var isSingleSspBeacon = {};
    var dfpTypes = {};
    var widgetIframes = {};
    var isLoadAmpContextLib = false;
    var sspBeaconUrls = {};
    var sspBeacons = [];
    var adObjs = {};
    var startedAdInview = false;
    var startedAdMovieNativeInview = false;
    var layzr;
    var gNeedAdnum = {};
    var gLoadedAdNum = {};
    var gIsRandomDisplay = {};
    var clientCallObjs = {};
    var adMovieObj = {
        nodeObj: {},
        adObj: {},
        timer: {},
        doneNearInview: {},
        movieLoaded: {}
    };
    var isMomentumParamAttach = {};
    var sspIdsInfoObj = {
        gmosspUserId: {},
        gmosspQueryId: {}
    };
    var _$ = function(e) {
        return d.getElementById(e)
    };
    var fillerAds = {};
    var criteoAdList = [];
    var criteoPosList = [];
    var fillerAd = {
        adNum: 0,
        fillAdNum: 0,
        vSpaceId: "",
        q: "",
        reqCount: {},
        validCount: {},
        isCompleted: {}
    };
    var dokuryoRecommendAnimationCallback;
    var dokuryoRecommendOverlayCallback;
    var allWidgetStatus;
    var monitorTime = 0;
    var isInsertedYdaDomSetting = false;
    GMOADRW = {};
    GMOADRW = {
        adRenderCallback: function(data) {
            if (data) {
                var widgetNode = __.getLastWidgetNodeBySpaceId("gmo_ad_" + data.space_id);
                var dads = data.ads;
                var dl = dads ? dads.length : 0;
                if (dl === 0) {
                    fillerAds[data.space_id].adNum = 0;
                    return
                }
                var script = d.getElementById("gmossp_" + data.space_id)
                  , gWidgetId = script.getAttribute("gWidgetId")
                  , gReqId = script.getAttribute("gReqId")
                  , gSpaceId = script.getAttribute("gSpaceId")
                  , gAdNum = script.getAttribute("gAdNum")
                  , gLeadArticleId = script.getAttribute("gLeadArticleId")
                  , gPermanentLink = script.getAttribute("gPermanentLink")
                  , gInvalidRedirectGmossp = script.getAttribute("gInvalidRedirectGmossp");
                try {
                    GMOADRW.setWidgetStatus(gWidgetId, "ad render callback start");
                    if (sspBeaconUrls[gWidgetId] === undefined)
                        sspBeaconUrls[gWidgetId] = [];
                    sspIdsInfoObj.gmosspUserId[gSpaceId] = data.gmossp_user ? data.gmossp_user : "";
                    sspIdsInfoObj.gmosspQueryId[gSpaceId] = data.q ? data.q : "";
                    GMOADRW.appendSspInfoToArticleClickUrl(widgetNode, gSpaceId);
                    isSingleSspBeacon[gWidgetId] = false;
                    if (data.iv_beacon && data.iv_beacon.length > 0) {
                        var topBcUrls;
                        if (isAmp === "1" || dfpTypes[gWidgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                            topBcUrls = data.iv_beacon.map(function(b) {
                                return "amp_" + b
                            });
                        else
                            topBcUrls = data.iv_beacon.map(function(b) {
                                var parentOffsetTop = GMOADRW.getParentOffsetTop(gWidgetId);
                                return b.replace(/\{\{w\}\}/, parentOffsetTop + widgetNode.offsetTop)
                            });
                        sspBeaconUrls[gWidgetId] = sspBeaconUrls[gWidgetId].concat(topBcUrls);
                        isSingleSspBeacon[gWidgetId] = true
                    }
                    var divs = widgetNode.getElementsByClassName("_taxel_ad_article_" + data.space_id);
                    var adObjCount = 0;
                    var nativeAds = dads.filter(ad=>{
                        return !GMOADRW.isBlankAd(ad) && !(ad.networkId === parseInt(AD_YDA) || ad.networkId === AD_YDA) && ad.networkId !== parseInt(AD_CRITEO) && ad.ad_type !== 1
                    }
                    );
                    let existAdCount = dads.filter(ad=>{
                        return !GMOADRW.isBlankAd(ad)
                    }
                    ).length;
                    fillerAds[data.space_id].vSpaceId = data.v_space_id;
                    fillerAds[data.space_id].q = data.q;
                    if (divs != null && existAdCount < divs.length) {
                        fillerAds[data.space_id].reqCount[AD_UNKNOWN] = divs.length - existAdCount;
                        fillerAds[data.space_id].validCount[AD_UNKNOWN] = 0;
                        fillerAds[data.space_id].isCompleted[AD_UNKNOWN] = true
                    }
                    var ydaDivs = [];
                    var ydaAds = [];
                    var ydaTaxelClickUrls = [];
                    var ydaSspClickUrls = [];
                    var filledNum = 0;
                    Array.prototype.forEach.call(divs, function($d, i) {
                        if (gLoadedAdNum[gWidgetId] === undefined)
                            gLoadedAdNum[gWidgetId] = 0;
                        gLoadedAdNum[gWidgetId]++;
                        var adPosition = i + 1;
                        var ad = dads[i];
                        fillAd = false;
                        if (i >= dl || GMOADRW.isBlankAd(ad)) {
                            if (nativeAds.length === 0)
                                return;
                            if (filledNum === nativeAds.length)
                                filledNum = 0;
                            ad = nativeAds[filledNum];
                            fillAd = true;
                            filledNum++
                        }
                        var div_a$ = $d.getElementsByTagName("a")[0]
                          , content$ = div_a$.getElementsByClassName("_taxel_recommend_content")[0];
                        if (ad.html !== undefined && ad.ad_type === 1) {
                            $d.parentNode.style.display = "";
                            div_a$.remove();
                            $d.className += " _not_shuffle_target_";
                            var pureAdIFrame = document.createElement("iframe");
                            $d.appendChild(pureAdIFrame);
                            var iFrameDocument = pureAdIFrame.contentWindow.document;
                            iFrameDocument.open();
                            iFrameDocument.write(unescape(ad.html));
                            iFrameDocument.close()
                        }
                        if (ad.c_type && ad.c_type !== 1)
                            return;
                        if (adObjs[gWidgetId] === undefined)
                            adObjs[gWidgetId] = [];
                        if (!isSingleSspBeacon[gWidgetId] && !fillAd)
                            adObjs[gWidgetId][adObjCount] = {
                                nodeObj: $d,
                                ivBeaconUrls: [],
                                beaconCreated: false
                            };
                        if (ad.iv_beacon && ad.iv_beacon.length > 0) {
                            var beaconUrls = [];
                            for (var j = 0; j < ad.iv_beacon.length; j++)
                                if (GMOADRW.getHostName(ad.iv_beacon[j]) === GMOSSP_DOMAIN)
                                    if (isAmp === "1" || dfpTypes[gWidgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                                        beaconUrls[j] = "amp_" + ad.iv_beacon[j];
                                    else {
                                        var parentOffsetTop = GMOADRW.getParentOffsetTop(gWidgetId);
                                        beaconUrls[j] = ad.iv_beacon[j].replace(/\{\{w\}\}/, parentOffsetTop + widgetNode.offsetTop)
                                    }
                                else
                                    beaconUrls[j] = ad.iv_beacon[j];
                            if (isSingleSspBeacon[gWidgetId])
                                sspBeaconUrls[gWidgetId] = sspBeaconUrls[gWidgetId].concat(beaconUrls);
                            if (!isSingleSspBeacon[gWidgetId] && !fillAd)
                                adObjs[gWidgetId][adObjCount]["ivBeaconUrls"] = beaconUrls
                        }
                        if (adObjs[gWidgetId][adObjCount])
                            adObjCount++;
                        var clientCallValue = GMOADRW.getClientCallValue(data.space_id);
                        if (ad["isClientAdCall"]) {
                            var networkId = ad["networkId"];
                            if (clientCallValue && clientCallValue[networkId] === undefined)
                                GMOADRW.initClientCall(networkId, gReqId, gLeadArticleId, gPermanentLink, gInvalidRedirectGmossp, gWidgetId, gSpaceId, gIsRandomDisplay[gWidgetId]);
                            GMOADRW.addClientCall(data.space_id, networkId, $d, ad, adPosition, fillAd)
                        } else {
                            $d.parentNode.style.display = "";
                            if (ad.impressionUrl)
                                GMOADRW.createBeaconForAdRenderCallback(ad.impressionUrl, $d)
                        }
                        if (GMOADRW.isCriteoDirectBidderAd(ad.ad_type, ad.c_type, ad.networkId)) {
                            let bidMap = GMOADRW.getCriteoBidObj(data.space_id);
                            if (bidMap.size > 0) {
                                let bid = bidMap.get(criteoPosList[i]);
                                GMOADRW.renderCriteoAd(ad, bid, $d, gWidgetId, cookieId, gReqId, gLeadArticleId, gSpaceId, gInvalidRedirectGmossp)
                            }
                        }
                        if (nativeAds.includes(ad) || ad.html === undefined && ad.ad_type === 1) {
                            var clickUrl = ad.clickUrl;
                            if (ad.forwardUrl)
                                clickUrl = ad.forwardUrl + encodeURIComponent(clickUrl) + "\x26pos\x3d" + adPosition + "\x26rwid\x3d1";
                            else if (GMOSSP_REDIRECT_DOMAIN_PATH.test(clickUrl))
                                clickUrl = clickUrl + "\x26pos\x3d" + adPosition + "\x26rwid\x3d1";
                            var imageUrls = GMOADRW.getImageUrls(ad);
                            GMOADRW.setAdClickUrl(div_a$, clickUrl, GMOADRW.createAdClickUrl(gWidgetId, cookieId, gReqId, gLeadArticleId, gSpaceId, clickUrl, gInvalidRedirectGmossp));
                            GMOADRW.setAdImage2(div_a$, imageUrls);
                            GMOADRW.setGmosspAdTitle(content$, ad.title);
                            GMOADRW.setGmosspAdDescription(content$, ad.description);
                            GMOADRW.setAdSponsor(content$, ad.sponsor_name)
                        }
                        if (ad["networkId"] === AD_YDA && ad["html"] !== undefined) {
                            if (!isInsertedYdaDomSetting) {
                                GMOADRW.setYdaDomSetting();
                                isInsertedYdaDomSetting = true
                            }
                            ydaDivs.push($d);
                            ydaAds.push(ad);
                            ydaTaxelClickUrls.push(GMOADRW.createYdaAdClickUrl(gWidgetId, cookieId, gReqId, gLeadArticleId, gSpaceId, gInvalidRedirectGmossp));
                            ydaSspClickUrls.push(ad.clickUrl)
                        }
                    });
                    if (ydaAds.length > 0)
                        GMOADRW.displayYdaAd(gWidgetId, ydaDivs, ydaAds, ydaTaxelClickUrls, ydaSspClickUrls);
                    var hasClientCallValue = GMOADRW.hasClientCallValue(data.space_id);
                    if (!hasClientCallValue && layzrEnable)
                        layzr.update().check();
                    var clientCallValue = GMOADRW.getClientCallValue(data.space_id);
                    var networkIds = Object.keys(clientCallValue);
                    var clientCallAdNum = 0;
                    for (var i in networkIds)
                        clientCallAdNum += clientCallValue[networkIds[i]].adNum;
                    fillerAds[data.space_id].adNum = clientCallAdNum;
                    if (gNeedAdnum[gWidgetId] === gLoadedAdNum[gWidgetId])
                        if (hasClientCallValue)
                            for (var networkId in clientCallValue) {
                                fillerAds[data.space_id].reqCount[networkId] = clientCallValue[networkId].adNum - clientCallValue[networkId].fillAdNum;
                                fillerAds[data.space_id].validCount[networkId] = 0;
                                fillerAds[data.space_id].isCompleted[networkId] = false;
                                try {
                                    switch (networkId) {
                                    case AD_IMOBILE:
                                        GMOADRW.requestClientCall(networkId, gWidgetId, data.space_id, gIsRandomDisplay[gWidgetId]);
                                        break;
                                    default:
                                    }
                                } catch (E) {} finally {
                                    fillerAds[data.space_id].isCompleted[networkId] = true
                                }
                            }
                        else if (gIsRandomDisplay[gWidgetId])
                            this.changeAdArticle(document.getElementById("gmo_rw_" + gWidgetId), data.space_id);
                    if (!isSingleSspBeacon[gWidgetId])
                        GMOADRW.adInview(C_TYPE_NATIVE);
                    if (isAmp !== "1") {
                        var event = document.createEvent("Event");
                        event.initEvent("adLoaded", true, true);
                        window.dispatchEvent(event)
                    }
                    Array.prototype.forEach.call(divs, function($d, i) {
                        if (!GMOADRW.isBlankAd(dads[i]) && dads[i] != null && dads[i]["networkId"] != null && gWidgetId != null && gSpaceId != null)
                            GMOADRW.addClassToDspArticleForNative(dads[i]["networkId"], gWidgetId, gSpaceId, i)
                    });
                    GMOADRW.setWidgetStatus(gWidgetId, "ad render callback end")
                } catch (e) {
                    GMOADRW.sendWidgetLog(gWidgetId, WLOG_STATUS_ERROR, e.message, __.getArticleIdResource())
                }
            }
        },
        adMovieRenderCallback: function(data) {
            if (!data || !data.ads || data.ads.length === 0)
                return;
            var ad = data.ads[0];
            var spaceId = data.space_id;
            adMovieObj.adObj[spaceId] = ad;
            if (ad.c_type !== C_TYPE_MOVIE) {
                GMOADRW.adMovieNativeRenderCallback(data);
                return
            }
            GMOADRW.setAdMovieProperty(ad);
            if (ad.impressionUrl && ad.impressionUrl.length > 0)
                for (var i = 0; i < ad.impressionUrl.length; i++)
                    GMOADRW.otherCreateBeacon(ad.impressionUrl[i]);
            var node = adMovieObj.nodeObj[spaceId];
            node.style.display = "inline";
            var movieContent;
            if (typeof ad.html_iframe === "undefined" || ad.html_iframe) {
                movieContent = document.createElement("iframe");
                movieContent.scrolling = "no";
                movieContent.frameBorder = "0";
                movieContent.style.width = "100%";
                movieContent.height = "0"
            } else {
                movieContent = document.createElement("div");
                movieContent.style.width = "100%";
                movieContent.height = "0"
            }
            movieContent.className = "_taxel_ad_movie_content";
            var movieId = TAXEL_AD_MOVIE_CT_ID + "_" + spaceId;
            movieContent.setAttribute("id", movieId);
            var content = node.getElementsByClassName("_taxel_ad_movie_content")[0];
            content.parentNode.replaceChild(movieContent, content);
            var linkTag = node.getElementsByTagName("a")[0];
            if (ad.taxel.removeLinkTag) {
                if (linkTag)
                    node.removeChild(linkTag)
            } else {
                var titleNewEl = node.getElementsByClassName("_taxel_ad_title")[0];
                if (titleNewEl)
                    titleNewEl.innerHTML = ad.description || "";
                var titleOldEl = node.getElementsByClassName("_taxel_ad_art_title")[0];
                if (titleOldEl)
                    titleOldEl.innerHTML = ad.description || "";
                var sponsorEl = node.getElementsByClassName("_taxel_ad_art_sponsor")[0];
                if (sponsorEl)
                    sponsorEl.innerHTML = ad.sponsor_name || "";
                else {
                    var orgSponsorEl = node.getElementsByClassName("_taxel_ad_art_org_sponsor_name")[0];
                    if (orgSponsorEl)
                        orgSponsorEl.innerHTML = ad.sponsor_name || ""
                }
                var clickUrl = ad.clickUrl;
                if (linkTag)
                    GMOADRW.setAdClickUrl(linkTag, clickUrl, clickUrl)
            }
            if (ad.html_load === "top")
                GMOADRW.adMovieNearInview(spaceId);
            else {
                content = node.getElementsByClassName("_taxel_ad_movie_content")[0];
                var adHeightPosition = GMOADRW.getContentTop(content);
                var nearInviewBeaconPosition = adHeightPosition - ADMOVIE_NEAR_INVIEW_PIXEL_NUM;
                var px = GMOADRW.getViewablePixel();
                if (0 != adHeightPosition && px >= nearInviewBeaconPosition)
                    GMOADRW.adMovieNearInview(spaceId);
                window.addEventListener("scroll", function() {
                    clearTimeout(adMovieObj.timer[spaceId]);
                    adMovieObj.timer[spaceId] = setTimeout(function() {
                        var px = GMOADRW.getViewablePixel();
                        var adHeightPosition = GMOADRW.getContentTop(content);
                        var nearInviewBeaconPosition = adHeightPosition - ADMOVIE_NEAR_INVIEW_PIXEL_NUM;
                        if (0 != adHeightPosition && px >= nearInviewBeaconPosition)
                            GMOADRW.adMovieNearInview(spaceId)
                    }, 50)
                }, false)
            }
            GMOADRW.adMovieInview(spaceId)
        },
        adMovieNativeRenderCallback: function(data) {
            var target = adMovieObj.nodeObj[data.space_id];
            if (!target)
                return;
            target.style.display = "inline";
            var ad = data.ads[0];
            var script = document.getElementById("gmossp_" + data.space_id);
            if (!script)
                return;
            GMOADRW.renderMovieNativeAd(target, ad, script);
            if (ad.impressionUrl)
                GMOADRW.createBeaconForAdRenderCallback(ad.impressionUrl, target);
            var widgetId = script.getAttribute("gWidgetId");
            if (ad.iv_beacon && ad.iv_beacon.length > 0) {
                var replacedBeaconUrls = ad.iv_beacon.map(function(beaconUrl) {
                    return GMOADRW.replaceBeaconUrl(beaconUrl, widgetId, target)
                });
                adMovieObj.widgetInfo = adMovieObj.widgetInfo || {};
                adMovieObj.widgetInfo[widgetId] = {
                    "spaceId": data.space_id
                };
                adMovieObj.adObj[data.space_id].ivBeaconUrls = replacedBeaconUrls;
                adMovieObj.adObj[data.space_id].replacedBeaconUrls = false;
                GMOADRW.adInview(C_TYPE_MOVIE)
            }
        },
        renderMovieNativeAd: function(target, ad, script) {
            var imageUrls = GMOADRW.getImageUrls(ad);
            var widgetId = script.getAttribute("gWidgetId");
            var requestId = script.getAttribute("gReqId");
            var spaceId = script.getAttribute("gSpaceId");
            var leadArticleId = script.getAttribute("gLeadArticleId");
            var div_a = target.getElementsByTagName("a")[0];
            var content = div_a.getElementsByClassName("_taxel_recommend_content")[0];
            var btn = div_a.getElementsByClassName("_taxel_ad_btn")[0];
            if (btn)
                btn.style.display = "none";
            var imgDiv = document.createElement("div");
            var imgClassName = imageUrls.imageUrl2 ? "_taxel_ad_art_img_2" : "_taxel_ad_art_img";
            imgDiv.className = imgClassName;
            imgDiv.style.cssText = "content:'';display:block;padding-top:56.25%;background-size:contain;";
            div_a.insertBefore(imgDiv, content);
            var clickUrl = ad.clickUrl;
            if (ad.forwardUrl)
                clickUrl = ad.forwardUrl + encodeURIComponent(clickUrl) + "\x26pos\x3d1\x26rwid\x3d1";
            else if (GMOSSP_REDIRECT_DOMAIN_PATH.test(clickUrl))
                clickUrl = clickUrl + "\x26pos\x3d1\x26rwid\x3d1";
            var clickUrlViaTaxel = GMOADRW.createAdClickUrl(widgetId, cookieId, requestId, leadArticleId, spaceId, clickUrl, "0");
            GMOADRW.setAdClickUrl(div_a, clickUrl, clickUrlViaTaxel);
            GMOADRW.setAdImage2(div_a, imageUrls);
            GMOADRW.setGmosspAdTitle(content, ad.title);
            GMOADRW.setGmosspAdDescription(content, ad.description);
            GMOADRW.setAdSponsor(content, ad.sponsor_name);
            var widgetNode = document.getElementById("gmo_rw_" + widgetId);
            if (GMOADRW.isDspNetworkId(ad.networkId) && widgetNode) {
                var articles = widgetNode.getElementsByClassName("_taxel_ad_movie");
                if (articles && articles.length > 0)
                    GMOADRW.addClassToDspArticleForMovieNative(articles)
            }
            if (layzrEnable)
                layzr.update().check()
        },
        setAdMovieProperty: function(ad) {
            ad.taxel = ad.taxel || {};
            ad.taxel.removeLinkTag = ad.networkId === AD_NEWSTV || ad.networkId === AD_APPVADOR || ad.networkId === AD_RELAIDO || ad.networkId === AD_AMOADMAX
        },
        requestAdWithAdFraudCheck: function(spaceId, adNum, widgetId, reqId, leadArticleId, permanentLink, ptnId, invalidRedirectGmossp, adFraudBidPoints) {
            if (!adFraudBidPoints[spaceId] || adFraudBidPoints[spaceId] <= Math.floor(Math.random() * 1E4))
                GMOADRW.requestAd(spaceId, adNum, widgetId, reqId, leadArticleId, permanentLink, ptnId, invalidRedirectGmossp);
            else {
                isMomentumParamAttach[spaceId] = true;
                var r = "heron_" + Math.floor(Math.random() * 1.8446744073709552E19);
                var ele1 = d.createElement("script");
                ele1.src = MOMENTUMJS;
                ele1.onload = function() {
                    var momentumDynamicScript = 'var heron_params \x3d "";' + "try {" + '  heron_params \x3d momentum_heron.get_prebid_params("' + r + '");' + "} catch (e) {" + '  if(e.message) heron_params \x3d e.message; else heron_params  \x3d "unknown";' + "}";
                    var ele2 = d.createElement("script");
                    ele2.language = "javascript";
                    ele2.id = r;
                    ele2.innerHTML = momentumDynamicScript;
                    d.getElementsByTagName("head")[0].appendChild(ele2);
                    GMOADRW.requestAd(spaceId, adNum, widgetId, reqId, leadArticleId, permanentLink, ptnId, invalidRedirectGmossp)
                }
                ;
                d.getElementsByTagName("head")[0].appendChild(ele1)
            }
        },
        replaceBeaconUrl: function(beaconUrl, widgetId, widgetNode) {
            if (GMOADRW.getHostName(beaconUrl) !== GMOSSP_DOMAIN)
                return beaconUrl;
            if (isAmp === "1" || dfpTypes[widgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                return "amp_" + beaconUrl;
            var parentOffsetTop = GMOADRW.getParentOffsetTop(widgetId);
            return beaconUrl.replace(/\{\{w\}\}/, parentOffsetTop + widgetNode.offsetTop)
        },
        requestAd: function(spaceId, adNum, widgetId, reqId, leadArticleId, permanentLink, ptnId, invalidRedirectGmossp) {
            GMOADRW.setWidgetStatus(widgetId, "request ad start");
            var sspAPI = SSPAPI + "?space_id\x3d" + spaceId + "\x26ad_format\x3djsonp" + "\x26callback\x3dGMOADRW.adRenderCallback" + "\x26rwid\x3d1" + "\x26ad_num\x3d" + adNum + "\x26gmorw_ptn\x3d" + ptnId + "\x26pageurl\x3d" + GMOADRW.getEncodedPageUrl() + "\x26ref\x3d" + GMOADRW.getEncodedReferrer() + "\x26hf\x3d" + GMOADRW.getAdHiddenFocus() + "\x26r\x3d" + Math.random()
              , script = d.createElement("script");
            sspAPI += GMOADRW.getGmosspXid();
            sspAPI += GMOADRW.sspAdditionalQueryAnalysis();
            if (topics)
                sspAPI += topics;
            var imUid = __.getCookieValue(IM_UID_COOKIE_NAME);
            if (imUid)
                sspAPI += "\x26im_uid\x3d" + imUid;
            if (isMomentumParamAttach[spaceId] && heron_params)
                sspAPI += "\x26heron\x3d" + heron_params;
            if (USE_CRITEO_DIRECT_BIDDER)
                sspAPI += GMOADRW.getCriteoBidParam(spaceId);
            script.src = sspAPI;
            script.setAttribute("id", "gmossp_" + spaceId);
            script.setAttribute("gWidgetId", widgetId);
            script.setAttribute("gReqId", reqId);
            script.setAttribute("gSpaceId", spaceId);
            script.setAttribute("gAdNum", adNum);
            script.setAttribute("gLeadArticleId", leadArticleId);
            script.setAttribute("gPermanentLink", permanentLink);
            script.setAttribute("gInvalidRedirectGmossp", invalidRedirectGmossp);
            d.getElementsByTagName("head")[0].appendChild(script);
            GMOADRW.setWidgetStatus(widgetId, "request ad end")
        },
        requestAdMovieWithAdFraudCheck: function(spaceId, adNum, widgetId, reqId, leadArticleId, ptnId, adFraudBidPoints) {
            if (!adFraudBidPoints[spaceId] || adFraudBidPoints[spaceId] <= Math.floor(Math.random() * 1E4))
                GMOADRW.requestAdMovie(spaceId, adNum, widgetId, reqId, leadArticleId, ptnId);
            else {
                isMomentumParamAttach[spaceId] = true;
                var r = "heron_" + Math.floor(Math.random() * 1.8446744073709552E19);
                var ele1 = d.createElement("script");
                ele1.src = MOMENTUMJS;
                ele1.onload = function() {
                    var momentumDynamicScript = 'var heron_params \x3d "";' + "try {" + '  heron_params \x3d momentum_heron.get_prebid_params("' + r + '");' + "} catch (e) {" + '  if(e.message) heron_params \x3d e.message; else heron_params  \x3d "unknown";' + "}";
                    var ele2 = d.createElement("script");
                    ele2.language = "javascript";
                    ele2.id = r;
                    ele2.innerHTML = momentumDynamicScript;
                    d.getElementsByTagName("head")[0].appendChild(ele2);
                    GMOADRW.requestAdMovie(spaceId, adNum, widgetId, ptnId)
                }
                ;
                d.getElementsByTagName("head")[0].appendChild(ele1)
            }
        },
        requestAdMovie: function(spaceId, adNum, widgetId, reqId, leadArticleId, ptnId) {
            var sspAPI = SSPAPI + "?space_id\x3d" + spaceId + "\x26ad_format\x3djsonp" + "\x26callback\x3dGMOADRW.adMovieRenderCallback" + "\x26rwid\x3d1" + "\x26ad_num\x3d" + adNum + "\x26gmorw_ptn\x3d" + ptnId + "\x26pageurl\x3d" + GMOADRW.getEncodedPageUrl() + "\x26ref\x3d" + GMOADRW.getEncodedReferrer() + "\x26hf\x3d" + GMOADRW.getAdHiddenFocus() + "\x26r\x3d" + Math.random()
              , script = d.createElement("script");
            var gmomAkFq = __.getCookieValue(AKANE_FQ_COOKIE_NAME);
            if (gmomAkFq)
                sspAPI += "\x26gmom_ak_fq\x3d" + gmomAkFq;
            var imUid = __.getCookieValue(IM_UID_COOKIE_NAME);
            if (imUid)
                sspAPI += "\x26im_uid\x3d" + imUid;
            sspAPI += GMOADRW.getGmosspXid();
            sspAPI += GMOADRW.sspAdditionalQueryAnalysis();
            if (isMomentumParamAttach[spaceId] && heron_params)
                sspAPI += "\x26heron\x3d" + heron_params;
            script.src = sspAPI;
            script.setAttribute("id", "gmossp_" + spaceId);
            script.setAttribute("gWidgetId", widgetId);
            script.setAttribute("gSpaceId", spaceId);
            script.setAttribute("gAdNum", adNum);
            script.setAttribute("gReqId", reqId);
            script.setAttribute("gLeadArticleId", leadArticleId);
            script.setAttribute("async", "true");
            d.getElementsByTagName("head")[0].appendChild(script)
        },
        sspFetchAncestorOrigin: function() {
            if (location.ancestorOrigins) {
                var len = location.ancestorOrigins.length;
                return 0 < len ? (new URL(location.ancestorOrigins[len - 1])).host : location.host
            }
            return ""
        },
        sspAdditionalQueryAnalysis: function() {
            var q = "";
            q += "\x26ao\x3d" + encodeURIComponent(GMOADRW.sspFetchAncestorOrigin());
            q += "\x26np\x3d" + encodeURIComponent(navigator.platform);
            return q
        },
        createAdClickUrl: function(widgetId, cookieId, reqId, leadArticleId, spaceId, clickUrl, invalidRedirectGmossp) {
            return BASE_URL + CLICK_URL + "?wi\x3d" + widgetId + "\x26id\x3d" + cookieId + "\x26ri\x3d" + reqId + "\x26li\x3d" + leadArticleId + "\x26si\x3d" + spaceId + "\x26u\x3d" + encodeURIComponent(clickUrl + "\x26gmorw_ptn\x3d" + __.getCookieValue(PATTERN_ID_COOKIE_NAME + widgetId)) + "\x26irf\x3d" + invalidRedirectGmossp + "\x26gu\x3d" + sspIdsInfoObj.gmosspUserId[spaceId] + "\x26q\x3d" + sspIdsInfoObj.gmosspQueryId[spaceId]
        },
        createYdaAdClickUrl: function(widgetId, cookieId, reqId, leadArticleId, spaceId, invalidRedirectGmossp) {
            return BASE_URL + CLICK_URL + "?wi\x3d" + widgetId + "\x26id\x3d" + cookieId + "\x26ri\x3d" + reqId + "\x26li\x3d" + leadArticleId + "\x26si\x3d" + spaceId + "\x26u\x3d" + DAMMY_CLICK_URL + "\x26irf\x3d" + invalidRedirectGmossp + "\x26gu\x3d" + sspIdsInfoObj.gmosspUserId[spaceId] + "\x26q\x3d" + sspIdsInfoObj.gmosspQueryId[spaceId]
        },
        appendSspInfoToArticleClickUrl: function(widgetNode, spaceId) {
            var divs = widgetNode.getElementsByClassName("_taxel_recommend_article");
            Array.prototype.forEach.call(divs, function(div) {
                var aTag = div.getElementsByTagName("a")[0];
                var aTagUrl = aTag.getAttribute("onmousedown");
                var newATagUrl = aTagUrl + '+"\x26gu\x3d' + sspIdsInfoObj.gmosspUserId[spaceId] + '"';
                aTag.setAttribute("onmousedown", newATagUrl)
            })
        },
        setAdClickUrl: function(div_a$, clickUrl, adClickUrl) {
            div_a$.setAttribute("href", clickUrl);
            if (!div_a$.hasAttribute("target"))
                div_a$.setAttribute("target", "_blank");
            div_a$.setAttribute("onclick", "");
            div_a$.setAttribute("onmousedown", 'this.href\x3d"' + adClickUrl + '"')
        },
        setAdImage: function(d$, imageUrl) {
            var imgTag$ = d$.querySelector("._taxel_ad_art_img") ? d$.querySelector("._taxel_ad_art_img") : d$.querySelector("._taxel_ad_art_img_2") ? d$.querySelector("._taxel_ad_art_img_2") : null;
            if (imgTag$) {
                if (layzrEnable)
                    imgTag$.setAttribute("data-layzr-normal", imageUrl);
                else
                    imgTag$.style.backgroundImage = 'url("' + imageUrl + '")';
                imgTag$.setAttribute("data-layzr-bg", "")
            }
            var imgSrcTag$ = d$.querySelector("._taxel_ad_art_img_src");
            if (imgSrcTag$)
                if (layzrEnable)
                    imgSrcTag$.setAttribute("data-layzr-normal", imageUrl);
                else
                    imgSrcTag$.style.backgroundImage = 'url("' + imageUrl + '")'
        },
        setAdImage2: function(d$, imageUrls) {
            var imgTag$ = d$.querySelector("._taxel_ad_art_img")
              , img2Tag$ = d$.querySelector("._taxel_ad_art_img_2")
              , imgSrcTag$ = d$.querySelector("._taxel_ad_art_img_src")
              , imgKeys = ["imageUrl", "ImageUrl2Small", "imageUrl2"]
              , imgKeys2 = ["ImageUrl2Small", "imageUrl2", "imageUrl"];
            if (img2Tag$) {
                var imgType = img2Tag$.getAttribute(DATA_IMAGE_TYPE);
                if (imgType)
                    imgKeys2.unshift(imgType);
                for (var i = 0; i < imgKeys2.length; i++) {
                    var key = imgKeys2[i];
                    if (imageUrls[key] && imageUrls[key] !== "") {
                        if (layzrEnable) {
                            img2Tag$.setAttribute("data-layzr-normal", imageUrls[key]);
                            img2Tag$.setAttribute("data-layzr-bg", "")
                        } else
                            img2Tag$.style.backgroundImage = 'url("' + imageUrls[key] + '")';
                        return
                    }
                }
            }
            if (imgTag$) {
                var imgType = imgTag$.getAttribute(DATA_IMAGE_TYPE);
                if (imgType)
                    imgKeys.unshift(imgType);
                for (var i = 0; i < imgKeys.length; i++) {
                    var key = imgKeys[i];
                    if (imageUrls[key] && imageUrls[key] !== "") {
                        if (layzrEnable) {
                            imgTag$.setAttribute("data-layzr-normal", imageUrls[key]);
                            imgTag$.setAttribute("data-layzr-bg", "")
                        } else
                            imgTag$.style.backgroundImage = 'url("' + imageUrls[key] + '")';
                        return
                    }
                }
            }
            if (imgSrcTag$)
                if (layzrEnable)
                    imgSrcTag$.setAttribute("data-layzr-normal", imageUrls.imageUrl);
                else
                    imgSrcTag$.style.backgroundImage = 'url("' + imageUrls.imageUrl + '")'
        },
        setGmosspAdTitle: function(d$, title) {
            var title$ = d$.querySelector("._taxel_ad_title");
            if (title$)
                title$.innerHTML = title
        },
        setOtherAdTitle: function(d$, title) {
            var title$ = d$.querySelector("._taxel_ad_title");
            if (title$)
                title$.innerHTML = title;
            var oldTitle$ = d$.querySelector("._taxel_ad_art_title");
            if (oldTitle$)
                oldTitle$.innerHTML = title
        },
        setGmosspAdDescription: function(d$, description) {
            if (!description)
                return;
            var description$ = d$.querySelector("._taxel_ad_description");
            if (description$)
                description$.innerHTML = description;
            var oldDescription$ = d$.querySelector("._taxel_ad_art_title");
            if (oldDescription$)
                oldDescription$.innerHTML = description
        },
        setAdSponsor: function(d$, sponsor) {
            var sponsor$ = d$.querySelector("._taxel_ad_art_sponsor");
            if (sponsor$)
                sponsor$.innerHTML = sponsor ? "PR (" + sponsor + ")" : "";
            else {
                var org_sponsor$ = d$.querySelector("._taxel_ad_art_org_sponsor_name");
                if (org_sponsor$)
                    org_sponsor$.innerHTML = sponsor ? sponsor : ""
            }
        },
        setAdSponsorForcibly: function(d$, sponsor) {
            var s1 = d$.querySelector("._taxel_ad_art_sponsor");
            var s2 = d$.querySelector("._taxel_ad_art_org_sponsor");
            var s3 = d$.querySelector("._taxel_sponsred");
            var s4 = d$.querySelector(".taxel_sponsred");
            var s5 = d$.querySelector("._taxel_sponsored");
            if (s1)
                s1.innerHTML = sponsor;
            else if (s2)
                s2.innerHTML = sponsor;
            else if (s3)
                s3.innerHTML = sponsor;
            else if (s4)
                s4.innerHTML = sponsor;
            else if (s5)
                s5.innerHTML = sponsor
        },
        setYdaDomSetting: function() {
            var ydaSkeltonStyleDom = document.createElement("style");
            ydaSkeltonStyleDom.innerText = `
.taxel_skelton {
    position: relative;
}
.taxel_skelton .taxel_yda {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: #fff;
}
.taxel_skelton ._taxel_ad_art_img, .taxel_skelton ._taxel_ad_art_title, .taxel_skelton ._taxel_recommend_art_description, .taxel_skelton ._taxel_recommend_art_optional, .taxel_skelton ._taxel_recommend_art_date {
    background: #eee !important;
}

@keyframes skeleton-animation {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

._taxel_image_top .taxel_skelton ._taxel_ad_art_img::before{
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    content: "";
    display: block;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: skeleton-animation 1.2s linear infinite;
}

._taxel_image_left .taxel_skelton ._taxel_ad_art_img::before {
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    content: "";
    display: block;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: skeleton-animation 1.2s linear infinite;
    position: absolute;
    height: 100%;
}
`;
            document.body.after(ydaSkeltonStyleDom);
            const preconnectLinks = ["//s.yimg.jp", "//im.ov.yahoo.co.jp", "//yads.yjtag.yahoo.co.jp", "//im.c.yimg.jp"];
            const preloadLinks = ["https://yads.c.yimg.jp/js/yads-async.js", "https://yads.c.yimg.jp/uadf/yads_vimps.js", "https://s.yimg.jp/images/listing/tool/yads/yads-timeline-ex.js", "https://s.yimg.jp/images/advertising/common/js/iicon.min.js", "https://s.yimg.jp/images/listing/tool/yads/ydn/creative/variable/plain_html.min.js"];
            const connectLinks = preconnectLinks.map(link=>`<link rel="preconnect" href="${link}">`);
            const loadLinks = preloadLinks.map(link=>`<link rel="preload" href="${link}" as="script">`);
            document.head.insertAdjacentHTML("beforeend", [...connectLinks, ...loadLinks].join(""))
        },
        getEncodedPageUrl: function() {
            var pageurl = "";
            try {
                pageurl = window.top.location.href
            } catch (e) {}
            if (isAmp)
                pageurl = __.taxel_url_replace(ampRefererReplaceRules, document.referrer);
            if (pageurl !== "")
                return encodeURIComponent(pageurl);
            return ""
        },
        getEncodedReferrer: function() {
            var referrer = "";
            try {
                referrer = window.top.document.referrer
            } catch (e) {
                referrer = document.referrer
            }
            if (isAmp)
                referrer = referrer.split("?")[0];
            return encodeURIComponent(referrer)
        },
        getAdHiddenFocus: function() {
            var hidden;
            if (typeof document.hidden !== "undefined")
                hidden = "hidden";
            else if (typeof document.msHidden !== "undefined")
                hidden = "msHidden";
            else if (typeof document.webkitHidden !== "undefined")
                hidden = "webkitHidden";
            else if (typeof document.mozHidden !== "undefined")
                hidden = "mozHidden";
            var isAdHiddenFocus = void hidden !== 0 ? !!document[hidden] : typeof document.hasFocus == "function" && !document.hasFocus();
            return isAdHiddenFocus ? 1 : 0
        },
        initClientCall: function(networkId, reqId, leadArticleId, permanentLink, invalidRedirectGmossp, widgetId, spaceId, isRandomDisplay) {
            var clientCallValue = {};
            clientCallValue[networkId] = {
                adUrls: null,
                forwardUrl: [],
                impressionUrls: [],
                adDocument: [],
                imobilePid: [],
                adNum: 0,
                fillAdNum: 0,
                widgetId: widgetId,
                spaceId: spaceId,
                reqId: reqId,
                leadArticleId: leadArticleId,
                permanentLink: permanentLink,
                isRandomDisplay: isRandomDisplay,
                invalidRedirectGmossp: invalidRedirectGmossp,
                ydnIdentificationKey: null
            };
            clientCallObjs[spaceId] = clientCallValue
        },
        addClientCall: function(spaceId, networkId, $d, adData, adPosition, fillAd) {
            var clientCallValue = GMOADRW.getClientCallValue(spaceId);
            if (adData["adCallUrl"])
                clientCallValue[networkId].adUrls = adData["adCallUrl"];
            clientCallValue[networkId].impressionUrls.push(adData["impressionUrl"]);
            var forwardUrl = adData["forwardUrl"];
            forwardUrl = forwardUrl.replace(/&url=$/, "\x26pos\x3d" + adPosition + "\x26rwid\x3d1\x26url\x3d");
            clientCallValue[networkId].forwardUrl.push(forwardUrl);
            if (networkId === AD_IMOBILE)
                clientCallValue[networkId].imobilePid.push(adData["imobilePid"]);
            clientCallValue[networkId].adNum++;
            if (fillAd)
                clientCallValue[networkId].fillAdNum++;
            clientCallValue[networkId].adDocument.push($d)
        },
        criteoBidding: function(json, widget) {
            const criteoBiddingTimeout = 2500;
            const reserveInsertRwTimeout = 3E3;
            setTimeout(function() {
                GMOADRW.insertRwWithCriteo(json, widget)
            }, reserveInsertRwTimeout);
            const adUnits = GMOADRW.createAdUnit(widget);
            if (!adUnits) {
                GMOADRW.insertRwWithCriteo(json, widget);
                return
            }
            try {
                const callback = function taxelCriteoCallback(json, widget) {
                    return function() {
                        try {
                            Criteo.GetBids().forEach(function(bid) {
                                return GMOADRW.setCriteoBids(bid)
                            })
                        } catch (e) {}
                        GMOADRW.insertRwWithCriteo(json, widget)
                    }
                };
                window.Criteo.events.push(()=>{
                    Criteo.SetLineItemRanges(CRITEO_CPM_RANGE);
                    Criteo.RequestBids(adUnits, callback(json, widget), criteoBiddingTimeout)
                }
                )
            } catch (e) {}
        },
        createAdUnit: function(widget) {
            const orgSpaceId = widget.spaceId;
            const cdb = widget.widgetOptions.cdb;
            const spaceId = cdb["adSpaceId"];
            const zoneMap = cdb["zoneMap"];
            const device = __.discriminantUserAgent();
            if (!cdb || !zoneMap || orgSpaceId !== spaceId)
                return null;
            const zoneIdAndPosList = zoneMap[device];
            if (!zoneIdAndPosList || zoneIdAndPosList.length === 0)
                return null;
            let placementList = [];
            zoneIdAndPosList.forEach(function(zoneIdAndPos) {
                let pos = zoneIdAndPos["pos"];
                let zoneId = zoneIdAndPos["zoneId"];
                criteoPosList.push(pos);
                placementList.push({
                    "slotid": spaceId + "-taxel-native-ad-unit-" + pos,
                    "zoneId": zoneId
                })
            });
            if (placementList.length === 0)
                return null;
            return {
                "placements": placementList
            }
        },
        insertRwWithCriteo: function(json, widget) {
            if (CRITEO_REQUESTED_WIDGET_IDS.includes(widget.id))
                return;
            CRITEO_REQUESTED_WIDGET_IDS.push(widget.id);
            GMOADRW.insertRw(json, widget.id, widget.spaceId, widget.adNum, [], widget.widgetId, widget.reqId, widget.leadArticleId, widget.permanentLink, widget.ptnId, widget.sessionId, widget.sessionStartTimestamp, widget.isPreviewContentTag, widget.isRandomDisplay, widget.invalidRedirectGmossp, widget.isAbTestWidgetUseIframe, widget.dokuryoUnitKey, widget.widgetOptions, widget.adFraudBidPoints)
        },
        setCriteoBids: function(bid) {
            criteoAdList.push(bid)
        },
        getCriteoBidObj: function(spaceId) {
            try {
                let criteoAdMap = new Map;
                criteoAdList.forEach(function(criteoAd) {
                    criteoPosList.forEach(function(pos) {
                        if (spaceId + "-taxel-native-ad-unit-" + pos === criteoAd.impressionId)
                            criteoAdMap.set(pos, criteoAd)
                    })
                });
                return criteoAdMap
            } catch (e) {
                return null
            }
        },
        getCriteoBidParam: function(spaceId) {
            let criteoAdMap = GMOADRW.getCriteoBidObj(spaceId);
            if (criteoAdMap.size <= 0)
                return "";
            try {
                let cpmBucketsParamText = "";
                let zoneIdsParamText = "";
                let adomainsParamText = "";
                let cridParamText = "";
                for (let pos of criteoPosList) {
                    let criteoAd = criteoAdMap.get(pos);
                    if (criteoAd) {
                        cpmBucketsParamText += `&cpm_buckets[${pos}]=${criteoAd.cpm}`;
                        zoneIdsParamText += `&zone_ids[${pos}]=${criteoAd.zoneId}`;
                        let nativePayload = criteoAd.nativePayload;
                        if (nativePayload)
                            adomainsParamText += `&adomains[${pos}]=${nativePayload.advertiser.domain}`;
                        let productList = nativePayload.products;
                        if (productList && productList.length >= 0) {
                            let product = productList[0];
                            if (product) {
                                let crid = md5(product.title + product.description);
                                cridParamText += `&crids[${pos}]=${crid}`
                            }
                        }
                    }
                }
                return cpmBucketsParamText + zoneIdsParamText + adomainsParamText + cridParamText
            } catch {
                return ""
            }
        },
        isCriteoDirectBidderAd: function(ad_type, c_type, network_id) {
            return ad_type === 2 && c_type === 1 && network_id === parseInt(AD_CRITEO)
        },
        renderCriteoAd: function(ad, bid, $d, gWidgetId, cookieId, gReqId, gLeadArticleId, gSpaceId, gInvalidRedirectGmossp) {
            var payLoad = bid.nativePayload;
            var product = payLoad.products[0];
            var advertiser = payLoad.advertiser;
            var clickUrl = product.click_url;
            var imageUrl = product.image.url;
            var title = product.title;
            var sponsorName = advertiser.description;
            $d.classList ? $d.classList.add(AD_CRITEO_CLASS) : $d.className = AD_CRITEO_CLASS;
            var div_a$ = $d.getElementsByTagName("a")[0]
              , content$ = div_a$.getElementsByClassName("_taxel_recommend_content")[0];
            var sponsor$ = content$.querySelector(".taxel_sponsred") || content$.querySelector("._taxel_sponsred") || content$.querySelector("._taxel_sponsored");
            if (sponsor$) {
                sponsor$.innerText = "";
                sponsor$.className = "_taxel_ad_art_sponsor"
            }
            $d.parentNode.style.display = "";
            var adClickUrl = GMOADRW.createAdClickUrl(gWidgetId, cookieId, gReqId, gLeadArticleId, gSpaceId, clickUrl, gInvalidRedirectGmossp);
            GMOADRW.setAdClickUrl(div_a$, clickUrl, adClickUrl);
            GMOADRW.setAdImage(div_a$, imageUrl);
            GMOADRW.setOtherAdTitle(div_a$, title);
            GMOADRW.setAdSponsor(div_a$, sponsorName);
            var privacy = payLoad.privacy;
            if (privacy && privacy.optout_click_url && privacy.optout_image_url) {
                var criteoAdInfo = d.createElement("a");
                criteoAdInfo.setAttribute("href", privacy.optout_click_url);
                criteoAdInfo.setAttribute("target", "_blank");
                criteoAdInfo.className = "_taxel_ad_mark_criteo_a_tag";
                var criteoAdImage = d.createElement("img");
                criteoAdImage.setAttribute("src", privacy.optout_image_url);
                criteoAdInfo.appendChild(criteoAdImage);
                var imarkTag$ = $d.querySelector("._taxel_ad_mark");
                if (imarkTag$) {
                    var imarkATag$ = $d.querySelector("._taxel_ad_mark_criteo_a_tag");
                    if (!imarkATag$) {
                        imarkTag$.appendChild(criteoAdInfo);
                        imarkTag$.style.display = ""
                    }
                } else {
                    var imark$ = d.createElement("div");
                    imark$.className = "_taxel_ad_mark _taxel_ad_mark_criteo";
                    imark$.appendChild(criteoAdInfo);
                    $d.appendChild(imark$)
                }
            }
            if (payLoad.impression_pixels && payLoad.impression_pixels.length > 0)
                for (var i = 0; i < payLoad.impression_pixels.length; i++)
                    GMOADRW.createBeaconForAdRenderCallback(payLoad.impression_pixels[0].url, $d);
            var sspImpUrls = ad.impressionUrl;
            if (sspImpUrls && sspImpUrls.length > 0)
                for (var i = 0; i < sspImpUrls.length; i++)
                    GMOADRW.createBeaconForAdRenderCallback(sspImpUrls[i], $d);
            if (layzrEnable)
                layzr.update().check()
        },
        criteoAdStub: function() {},
        getTimeLineRandomNum: function() {
            return Math.floor(1E7 * Math.random())
        },
        getRandomNum: function() {
            return Math.floor(Math.random() * 1E7)
        },
        getTimestamp: function() {
            return parseInt((new Date).getTime())
        },
        createYdnCallUrl: function(url) {
            return url.replace(new RegExp("{timelineRandomNum}"), GMOADRW.getTimeLineRandomNum()).replace(new RegExp("{randomNum}"), GMOADRW.getRandomNum()).replace(new RegExp("{randomNum}"), GMOADRW.getRandomNum()).replace(new RegExp("{timestamp}"), GMOADRW.getTimestamp()).replace(new RegExp("{u}"), encodeURIComponent(d.location.href.toString()))
        },
        requestClientCallJsonp: function(requestUrl) {
            var script = d.createElement("script");
            script.src = requestUrl;
            d.getElementsByTagName("head")[0].appendChild(script)
        },
        requestClientCall: function(networkId, widgetId, spaceId, isRandom) {
            var client = new XMLHttpRequest;
            client.onreadystatechange = function() {
                if (client.readyState == 4 && client.status == 200) {
                    var response = JSON.parse(client.responseText);
                    var ads = response.result.ads;
                    var asid = response.result.asid;
                    var clientCallValue = GMOADRW.getClientCallValue(spaceId);
                    var needAdNum = clientCallValue[networkId].adNum;
                    var fillAdNum = clientCallValue[networkId].fillAdNum;
                    for (var i = 0; i < needAdNum; i++) {
                        var articleIndex = i % ads.length;
                        var advid = ads[articleIndex]["advid"];
                        var ctid = ads[articleIndex]["ctid"];
                        var vh = ads[articleIndex]["vh"];
                        var eid = ads[articleIndex]["eid"];
                        var pid = clientCallValue[networkId].imobilePid[i];
                        var adUrl = "//spsvc3.i-mobile.co.jp/ad_link.ashx?pid\x3d" + pid + "\x26asid\x3d" + asid + "\x26advid\x3d" + advid + "\x26ctid\x3d" + ctid + "\x26vh\x3d" + vh;
                        var clickUrl = clientCallValue[networkId].forwardUrl[i] + encodeURIComponent(adUrl);
                        var imageUrl = "//spcdnsp.i-mobile.co.jp/ad_creative.ashx?advid\x3d" + advid + "\x26eid\x3d" + eid;
                        var description = ads[articleIndex]["description"];
                        var sponsorName = ads[articleIndex]["sponsored"];
                        var $d = clientCallValue[networkId].adDocument[i];
                        var div_a$ = $d.getElementsByTagName("a")[0]
                          , content$ = div_a$.getElementsByClassName("_taxel_recommend_content")[0];
                        $d.parentNode.style.display = "";
                        var adClickUrl = GMOADRW.createAdClickUrl(widgetId, cookieId, clientCallValue[networkId].reqId, clientCallValue[networkId].leadArticleId, spaceId, clickUrl, clientCallValue[networkId].invalidRedirectGmossp);
                        GMOADRW.setAdClickUrl(div_a$, clickUrl, adClickUrl);
                        GMOADRW.setAdImage(div_a$, imageUrl);
                        GMOADRW.setOtherAdTitle(content$, description);
                        GMOADRW.setAdSponsor(content$, sponsorName);
                        if (i < needAdNum - fillAdNum)
                            fillerAds[spaceId].validCount[networkId]++
                    }
                }
                if (layzrEnable)
                    layzr.update().check();
                if (isRandom)
                    GMOADRW.changeAdArticle(document.getElementById("gmo_rw_" + widgetId), spaceId)
            }
            ;
            var clientCallValue = GMOADRW.getClientCallValue(spaceId);
            client.open("get", clientCallValue[networkId].adUrls, true);
            client.send(null)
        },
        decodeHtml: function(html) {
            if (typeof html !== "string")
                return html;
            return html.replace(/</g, "\x3c").replace(/>/g, "\x3e").replace(/&/g, "\x26").replace(/"/g, '"').replace(/&#39;/g, "'")
        },
        createInviewBeacons: function(widgetId, reqId, leadArticleId, elementId) {
            var dEle = __.getLastWidgetNodeById(elementId);
            dEle.insertBefore(GMOADRW.createBeacon(widgetId, "TOP", 0), dEle.firstChild);
            GMOADRW.insertAfter(GMOADRW.createBeacon(widgetId, "BOTTOM", 2), dEle.lastChild);
            GMOADRW.refreshBeacons(widgetId, leadArticleId, reqId);
            GMOADRW.inviewLog(leadArticleId, widgetId, reqId)
        },
        isBounceContent: function() {
            return document.getElementById("dokuryoBounceContent")
        },
        getXid: function(s, key) {
            try {
                var xid = s.getItem(key);
                if (0 < xid.length)
                    return xid
            } catch (e) {}
            return GMOADRW.generateXid(s, key)
        },
        generateXid: function(s, key) {
            var c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
              , r = "";
            for (var i = 0; i < 16; i++)
                r += c[Math.floor(Math.random() * 62)];
            try {
                s.setItem(key, r)
            } catch (e) {
                return ""
            }
            return r
        },
        getGmosspXid: function() {
            try {
                return "\x26xid\x3d" + GMOADRW.getXid(window.localStorage, GMOSSP_XID_NAME)
            } catch (e) {
                return ""
            }
        },
        insertWidgets: function(data) {
            Array.prototype.forEach.call(data.widgets, function(widget) {
                if (widget.insertType === INSERT_EMPTY_RW) {
                    GMOADRW.insertEmptyRW(widget.widgetId, widget.ptnId, widget.sessionId, widget.sessionStartTimestamp);
                    return
                }
                if (widget.insertType === INSERT_BOUNCE_POS_RECOMMEND) {
                    GMOADRW.insertBouncePosRecommend(widget.bounceRecommend, widget.bouncePosition, widget.dokuryoUnitKey, widget.bounceThreshold, widget.bounceBlacklist, widget.bounceBlacklistExtendPixel, widget.bounceBlacklistExtendPixel, widget.finishRate, widget.bounceInsertType);
                    return
                }
                if (widget.insertType === INSERT_OTHER_RW) {
                    GMOADRW.insertOtherRw(widget.id, widget.widgetId, widget.ptnId, widget.contentTag, widget.provider, widget.sessionId, widget.sessionStartTimestamp, widget.prevRequestId, widget.reqId, widget.leadArticleId, widget.isAbTestWidgetUseIframe, widget.dfpType);
                    return
                }
                var json = {
                    "response": {
                        "html": ""
                    }
                };
                let useCriteo = USE_CRITEO_DIRECT_BIDDER && widget.widgetOptions.cdb != null;
                if (widget.insertType === INSERT_RW_USE_HANDLERS_BAR) {
                    json.response.html = widget.html;
                    if (useCriteo)
                        GMOADRW.criteoBidding(json, widget);
                    else
                        GMOADRW.insertRw(json, widget.id, widget.spaceId, widget.adNum, [], widget.widgetId, widget.reqId, widget.leadArticleId, widget.permanentLink, widget.ptnId, widget.sessionId, widget.sessionStartTimestamp, widget.isPreviewContentTag, widget.isRandomDisplay, widget.invalidRedirectGmossp, widget.isAbTestWidgetUseIframe, widget.dokuryoUnitKey, widget.widgetOptions, widget.adFraudBidPoints);
                    return
                }
                var template = widget.template.replaceAll("{{request_id}}", widget.reqId);
                template = template.replaceAll("{{ad_space_id}}", widget.spaceId);
                Array.prototype.forEach.call(widget.articles, function(art, i) {
                    template = GMOADRW.insertArticleInfo(template, "{{title_" + i + "}}", art.title);
                    template = GMOADRW.insertArticleInfo(template, "{{image_url_" + i + "}}", art.imageUrl);
                    template = GMOADRW.insertArticleInfo(template, "{{media_url_" + i + "}}", art.mediaUrl);
                    template = GMOADRW.insertArticleInfo(template, "{{public_dt_" + i + "}}", art.publicDt);
                    template = GMOADRW.insertArticleInfo(template, "{{article_id_" + i + "}}", art.articleId);
                    template = GMOADRW.insertArticleInfo(template, "{{visible_article_" + i + "}}", art.visibleArticle);
                    template = GMOADRW.insertArticleInfo(template, "{{onmousedown_url_" + i + "}}", art.onMouseDownUrl);
                    template = GMOADRW.insertArticleInfo(template, "{{optional_content_" + i + "}}", art.optionalContent);
                    template = GMOADRW.insertArticleInfo(template, "{{description_content_" + i + "}}", art.descriptionContent)
                });
                json.response.html = widget.css + template;
                if (useCriteo)
                    GMOADRW.criteoBidding(json, widget);
                else
                    GMOADRW.insertRw(json, widget.id, widget.spaceId, widget.adNum, [], widget.widgetId, widget.reqId, widget.leadArticleId, widget.permanentLink, widget.ptnId, widget.sessionId, widget.sessionStartTimestamp, widget.isPreviewContentTag, widget.isRandomDisplay, widget.invalidRedirectGmossp, widget.isAbTestWidgetUseIframe, widget.dokuryoUnitKey, widget.widgetOptions, widget.adFraudBidPoints)
            })
        },
        insertArticleInfo: function(template, mustache, val) {
            return template.replace(mustache, val)
        },
        insertRw: function(json, id, spaceId, adNum, adTypes, widgetId, reqId, leadArticleId, permanentLink, ptnId, sessionId, sessionStartTimestamp, isPreviewContentTag, isRandomDisplay, invalidRedirectGmossp, isAbTestWidgetUseIframe, dokuryoUnitKey, widgetOptions, adFraudBidPoints) {
            try {
                GMOADRW.setWidgetStatus(widgetId, "insert rw start");
                var patternIdCookieName = PATTERN_ID_COOKIE_NAME + widgetId;
                if (ptnId === "") {
                    if (__.hasCookie(patternIdCookieName))
                        GMOADRW.removeCookie(patternIdCookieName)
                } else
                    __.setCookieValue(patternIdCookieName, ptnId, PATTERN_ID_EXPIRE_SECOND);
                var session = sessionId + "." + sessionStartTimestamp;
                __.setCookieValue(SESSION_COOKIE_NAME + mediaId, session, SESSION_EXPIRE_SECOND);
                __.addLeadArticleIdsCookie(leadArticleId);
                if (widgetOptions.isTaxelWidgetInsideIframe)
                    dfpTypes[widgetId] = widgetOptions.isTaxelWidgetInsideIframe;
                else
                    dfpTypes[widgetId] = widgetOptions.dfpType;
                if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME)
                    widgetIframes[widgetId] = GMOADRW.getIframeContainWidget();
                if (dfpTypes[widgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                    GMOADRW.loadAmpContextLib();
                var widgetNode = __.getLastWidgetNodeById(id);
                if (widgetNode && window.getComputedStyle(widgetNode).getPropertyValue("display") === "none")
                    return;
                if (isPreviewContentTag) {
                    var s = document.createElement("script");
                    s.innerHTML = json.response.html;
                    widgetNode.appendChild(s)
                } else {
                    widgetNode.innerHTML = GMOADRW.decodeHtml(json.response.html);
                    widgetNode.classList.add("gmo_ad_" + spaceId);
                    if (isAbTestWidgetUseIframe)
                        widgetNode.setAttribute("onmouseover", 'GMOADRW.writeReqIdCookieIframe("' + reqId + '")');
                    else
                        widgetNode.setAttribute("onmousedown", 'GMOADRW.writeReqIdCookieNew("' + reqId + '")')
                }
                gIsRandomDisplay[widgetId] = isRandomDisplay;
                layzrEnable = widgetOptions.layzrIsEnabled === 0 ? 0 : 1;
                if (layzrEnable) {
                    if (layzr === undefined) {
                        layzr = new Layzr({
                            threshold: 30,
                            normal: "data-layzr-normal"
                        });
                        layzr.on("src:after", function(el) {
                            if (el.hasAttribute("data-layzr-bg")) {
                                el.style.backgroundImage = 'url("' + el.getAttribute("src") + '")';
                                el.removeAttribute("src");
                                el.removeAttribute("data-layzr-bg")
                            }
                        })
                    }
                    var mainEl = widgetNode.getElementsByClassName("_taxel_recommend_articles")[0];
                    var animOpt = mainEl.getAttribute("data-animate");
                    if (__.isPosInt(animOpt) && isAmp !== "1")
                        this.setupAnimateHandler(widgetNode, spaceId, animOpt, layzr);
                    layzr.update().check().handlers(true)
                } else {
                    var childNodes = document.querySelector("#gmo_rw_" + widgetId).querySelectorAll("a");
                    for (var i = 0; i < childNodes.length; i++) {
                        var child = childNodes[i].childNodes;
                        for (var j = 0; j < child.length; j++)
                            if (child[j].nodeName === "DIV" && child[j].hasAttribute("data-layzr-normal")) {
                                child[j].style.backgroundImage = 'url("' + child[j].getAttribute("data-layzr-normal") + '")';
                                child[j].removeAttribute("data-layzr-normal");
                                child[j].removeAttribute("data-layzr-bg");
                                break
                            }
                    }
                }
                if (gNeedAdnum[widgetId] === undefined)
                    gNeedAdnum[widgetId] = 0;
                gNeedAdnum[widgetId] += adNum;
                GMOADRW.cookieSyncReemoToGoogle();
                if (gNeedAdnum[widgetId] === 0) {
                    GMOADRW.insertRwDetail(widgetNode, widgetId, adNum, reqId, leadArticleId, ptnId, adFraudBidPoints, spaceId, widgetOptions, dokuryoUnitKey);
                    return
                }
                if (receivedTopicsMessage) {
                    GMOADRW.requestAdWithAdFraudCheck(spaceId, adNum, widgetId, reqId, leadArticleId, permanentLink, ptnId, invalidRedirectGmossp, adFraudBidPoints);
                    GMOADRW.insertRwDetail(widgetNode, widgetId, adNum, reqId, leadArticleId, ptnId, adFraudBidPoints, spaceId, widgetOptions, dokuryoUnitKey);
                    return
                }
                (new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        resolve()
                    }, 300)
                }
                )).then(function(e) {
                    GMOADRW.requestAdWithAdFraudCheck(spaceId, adNum, widgetId, reqId, leadArticleId, permanentLink, ptnId, invalidRedirectGmossp, adFraudBidPoints);
                    GMOADRW.insertRwDetail(widgetNode, widgetId, adNum, reqId, leadArticleId, ptnId, adFraudBidPoints, spaceId, widgetOptions, dokuryoUnitKey)
                })
            } catch (e) {
                var element = document.createElement("script");
                var insNode = document.getElementById("gmo_rw_" + widgetId);
                GMOADRW.sendWidgetLog(widgetId, WLOG_STATUS_ERROR, e.message, __.getArticleIdResource())
            }
        },
        insertRwDetail: function(widgetNode, widgetId, adNum, reqId, leadArticleId, ptnId, adFraudBidPoints, spaceId, widgetOptions, dokuryoUnitKey) {
            var spaceIds = GMOADRW.findAdMovieTag(widgetNode);
            var adMovieNum = spaceIds.length;
            for (var i = 0; i < adMovieNum; i++) {
                var requestAdNum = 1;
                this.requestAdMovieWithAdFraudCheck(spaceIds[i], requestAdNum, widgetId, reqId, leadArticleId, ptnId, adFraudBidPoints)
            }
            fillerAds[spaceId] = JSON.parse(JSON.stringify(fillerAd));
            fillerAds[spaceId].adNum = adNum;
            GMOADRW.noticeFillerAd(fillerAds[spaceId], widgetId);
            GMOADRW.createInviewBeacons(widgetId, reqId, leadArticleId, "gmo_rw_" + widgetId);
            this.switchLogo(widgetNode);
            bannerNearInviewEnable = widgetOptions.bannerNearInviewIsEnabled === 0 ? 0 : 1;
            GMOADRW.handleExternalScript(widgetNode, leadArticleId, widgetId);
            if (dokuryoUnitKey)
                GMOADRW.insertDokuryoTag(dokuryoUnitKey, widgetOptions.dokuryo);
            if (GMOADRW.isBounceContent()) {
                dokuryoRecommendAnimationCallback = function() {
                    GMOADRW.setDokuryoRecommendAnimation(widgetId)
                }
                ;
                window.parent.addEventListener("scroll", dokuryoRecommendAnimationCallback)
            }
            GMOADRW.insertImuidTag();
            GMOADRW.addHandPointerCss();
            GMOADRW.setWidgetStatus(widgetId, "insert rw end")
        },
        refreshBeacons: function(widgetId, leadArticleId, reqId) {
            gBeacons = gBeacons.filter(function(v, i) {
                return v[4] !== widgetId
            });
            var topBeacon = GMOADRW.getBeaconPos(GMOADRW.getBeaconId(widgetId, "TOP"), widgetId, leadArticleId, reqId);
            var bottomBeacon = GMOADRW.getBeaconPos(GMOADRW.getBeaconId(widgetId, "BOTTOM"), widgetId, leadArticleId, reqId);
            var widgetHeight = bottomBeacon[0] - topBeacon[0];
            var numberCount = Math.round(widgetHeight / INVIEW_PIXEL_NUM);
            var cBeacon;
            if (numberCount <= 2) {
                cBeacon = [Math.round((topBeacon[0] + bottomBeacon[0]) / 2), Math.round((topBeacon[1] + bottomBeacon[1]) / 2), "CENTER", 1, widgetId, leadArticleId, reqId];
                gBeacons.push(cBeacon);
                beaconNumberForWidget[widgetId] = 1;
                sspBeacons.push(cBeacon)
            } else {
                var insertLoopNum = numberCount - 1;
                var centerIdx = Math.floor(insertLoopNum / 2);
                beaconNumberForWidget[widgetId] = insertLoopNum;
                for (var i = 0; i < insertLoopNum; i++) {
                    cBeacon = [Math.round((i + 1) * INVIEW_PIXEL_NUM) + topBeacon[0], Math.round((i + 1) * INVIEW_PIXEL_NUM) + topBeacon[1], "CENTER", 1, widgetId, leadArticleId, reqId];
                    gBeacons.push(cBeacon);
                    if (centerIdx === i)
                        sspBeacons.push(cBeacon)
                }
            }
        },
        insertOtherRw: function(id, widgetId, ptnId, contentTag, provider, sessionId, sessionStartTimestamp, prevRequestId, reqId, leadArticleId, isAbTestWidgetUseIframe, dfpType) {
            var patternIdCookieName = PATTERN_ID_COOKIE_NAME + widgetId;
            if (ptnId === "") {
                if (__.hasCookie(patternIdCookieName))
                    GMOADRW.removeCookie(patternIdCookieName)
            } else
                __.setCookieValue(patternIdCookieName, ptnId, PATTERN_ID_EXPIRE_SECOND);
            __.setCookieValue(SESSION_COOKIE_NAME + mediaId, sessionId + "." + sessionStartTimestamp, SESSION_EXPIRE_SECOND);
            __.addLeadArticleIdsCookie(leadArticleId);
            dfpTypes[widgetId] = dfpType;
            if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME)
                widgetIframes[widgetId] = GMOADRW.getIframeContainWidget();
            if (dfpTypes[widgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                GMOADRW.loadAmpContextLib();
            var txt = d.createElement("textarea");
            txt.innerHTML = contentTag;
            var elements = GMOADRW.getElements(txt.value);
            var widgetNode = __.getLastWidgetNodeById(id);
            var pdiv = d.createElement("div");
            if (isAbTestWidgetUseIframe)
                pdiv.setAttribute("onmouseover", 'GMOADRW.writeReqIdCookieIframe("' + prevRequestId + '")');
            else
                pdiv.setAttribute("onmousedown", 'GMOADRW.writeReqIdCookieNew("' + prevRequestId + '")');
            if (mediaId === "13" || mediaId === "37" || mediaId === "55")
                AB_TEST_PARENT = "taxel_ab_test_parent";
            pdiv.id = AB_TEST_PARENT;
            widgetNode.parentNode.insertBefore(pdiv, widgetNode);
            for (var i = 0; i < elements.length; i++)
                if (elements[i].nodeName.toLowerCase() == "script") {
                    script = d.createElement("script");
                    var attrs = elements[i].attributes;
                    for (var j = 0; j < attrs.length; j++)
                        script.setAttribute(attrs[j].name, attrs[j].value);
                    script.innerHTML = elements[i].innerHTML;
                    pdiv.appendChild(script)
                } else {
                    var currentElement = elements[i].cloneNode(true);
                    pdiv.appendChild(currentElement)
                }
            GMOADRW.createInviewBeacons(widgetId, reqId, leadArticleId, AB_TEST_PARENT)
        },
        insertEmptyRW: function(widgetId, ptnId, sessionId, sessionStartTimestamp) {
            var patternIdCookieName = PATTERN_ID_COOKIE_NAME + widgetId;
            if (ptnId === "") {
                if (__.hasCookie(patternIdCookieName))
                    GMOADRW.removeCookie(patternIdCookieName)
            } else
                __.setCookieValue(patternIdCookieName, ptnId, PATTERN_ID_EXPIRE_SECOND);
            var session = sessionId + "." + sessionStartTimestamp;
            __.setCookieValue(SESSION_COOKIE_NAME + mediaId, session, SESSION_EXPIRE_SECOND)
        },
        invalidRW: function(widgetId, errorCode) {},
        createBeacon: function(widgetId, type, index) {
            var arDiv = d.createElement("div");
            arDiv.setAttribute("id", GMOADRW.getBeaconId(widgetId, type));
            arDiv.dataset.type = type;
            arDiv.dataset.index = index;
            return arDiv
        },
        sumBeaconForWidgets: function(ids) {
            var sum = 0;
            for (var i = 0; i < ids.length; i++)
                sum += beaconNumberForWidget[ids[i]];
            return sum
        },
        getBeaconId: function(widgetId, type) {
            return "gmo_rw_b_" + widgetId + "_" + type
        },
        insertAfter: function(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
        },
        writeReqIdCookie: function(requestId) {},
        writeReqIdCookieNew: function(requestId) {
            var date = new Date;
            date.setSeconds(date.getSeconds() + REQUEST_EXPIRE_SECOND);
            d.cookie = REQUEST_ID_COOKIE_NAME + "\x3d" + requestId + "; expires\x3d" + date.toGMTString() + "; path\x3d/" + ";"
        },
        writeReqIdCookieIframe: function(requestId) {
            if (!__.hasCookie(REQUEST_ID_COOKIE_NAME)) {
                var date = new Date;
                date.setSeconds(date.getSeconds() + REQUEST_EXPIRE_SECOND);
                d.cookie = REQUEST_ID_COOKIE_NAME + "\x3d" + requestId + "; expires\x3d" + date.toGMTString() + "; path\x3d/" + ";"
            }
        },
        removeCookie: function(name) {
            var date = new Date;
            date.setSeconds(date.getSeconds() - 10);
            d.cookie = name + "\x3d" + "; expires\x3d" + date.toGMTString() + "; path\x3d/" + ";"
        },
        removeReqIdCookie: function() {
            var date = new Date;
            date.setSeconds(date.getSeconds() - 10);
            d.cookie = REQUEST_ID_COOKIE_NAME + "\x3d" + "; expires\x3d" + date.toGMTString() + "; path\x3d/" + ";"
        },
        noticeFillerAd: function(fillerAd, widgetId) {
            var timerId = setInterval(function() {
                if (fillerAd.adNum === 0) {
                    clearInterval(timerId);
                    return
                }
                var networkIds = Object.keys(fillerAd.reqCount);
                var reqCountArray = [];
                var fillerArray = [];
                if (networkIds.length === 0)
                    return;
                for (var i in networkIds) {
                    var networkId = networkIds[i];
                    if (!fillerAd.isCompleted[networkId])
                        return;
                    var fillerCount = fillerAd.reqCount[networkId] - fillerAd.validCount[networkId];
                    reqCountArray.push(fillerAd.reqCount[networkId]);
                    fillerArray.push(fillerCount)
                }
                clearInterval(timerId);
                var parameter = "?space_id\x3d" + fillerAd.vSpaceId + "\x26network_id\x3d" + networkIds.join("-") + "\x26req_cnt\x3d" + reqCountArray.join("-") + "\x26filler\x3d" + fillerArray.join("-") + "\x26q\x3d" + fillerAd.q;
                var fillerAPI = SSPFILLERAPI + parameter + "\x26rwid\x3d1";
                GMOADRW.sendRequest(fillerAPI);
                if (/[^0]/.exec(fillerArray.join(""))) {
                    var noticeMissingAds = BASE_URL + MISSING_ADS_URL + parameter + "\x26widget_id\x3d" + widgetId;
                    GMOADRW.sendRequest(noticeMissingAds)
                }
            }, 1E3)
        },
        sendRequest: function(requestUrl) {
            var script = document.createElement("script");
            script.src = requestUrl;
            d.getElementsByTagName("head")[0].appendChild(script)
        },
        adInview: function(type) {
            if (type === C_TYPE_NATIVE) {
                if (startedAdInview)
                    return;
                startedAdInview = true
            } else if (type === C_TYPE_MOVIE) {
                if (startedAdMovieNativeInview)
                    return;
                startedAdMovieNativeInview = true
            } else
                return;
            addListener(type);
            function registerAdTimer(c) {
                Array.prototype.forEach.call(Ids, function(wid) {
                    if (isSingleSspBeacon[wid])
                        return;
                    if (adObjs[wid] && adObjs[wid].length > 0)
                        for (var i = 0; i < adObjs[wid].length; i++) {
                            var ad = adObjs[wid][i];
                            if (!ad.beaconCreated && ad.nodeObj && ad.ivBeaconUrls && ad.ivBeaconUrls.length > 0) {
                                var adNode = ad.nodeObj;
                                var adNodeContentTop = getAdNodeContentTop(adNode, wid, dfpTypes[wid]);
                                var adCenter = getAdNodeContentCenter(adNode, adNodeContentTop);
                                var inside = isInside(dfpTypes[wid], adCenter, c);
                                if (inside)
                                    startAdTimer(ad, c, C_TYPE_NATIVE);
                                else
                                    clearAdTimer(ad)
                            }
                        }
                })
            }
            function registerAdMovieNativeTimer(c) {
                Array.prototype.forEach.call(Ids, function(widgetId) {
                    var widgetInfo = adMovieObj.widgetInfo[widgetId];
                    if (!widgetInfo)
                        return;
                    var ad = adMovieObj.adObj[widgetInfo.spaceId];
                    if (!ad || ad.beaconCreated || !ad.ivBeaconUrls || ad.ivBeaconUrls.length <= 0)
                        return;
                    var adNode = adMovieObj.nodeObj[widgetInfo.spaceId];
                    var adNodeContentTop = getAdNodeContentTop(adNode, widgetId, dfpTypes[widgetId]);
                    var adCenter = getAdNodeContentCenter(adNode, adNodeContentTop);
                    var inside = isInside(dfpTypes[widgetId], adCenter, c);
                    if (inside)
                        startAdTimer(ad, c, C_TYPE_MOVIE);
                    else
                        clearAdTimer(ad)
                })
            }
            function startAdTimer(ad, c, type) {
                if (!ad.timerId)
                    ad.timerId = setTimeout(function() {
                        ad.ivBeaconUrls.forEach(function(url) {
                            if (isAmp === "1" || isDfpAmpSafeFrameFixedSize())
                                url = url.match(/^amp_/) ? url.substr(4).replace(/\{\{w\}\}/, c.boundingClientRect.top) : url;
                            GMOADRW.otherCreateBeacon(url)
                        });
                        ad.beaconCreated = true;
                        if (isAmp !== "1" && !isDfpAmpSafeFrameFixedSize())
                            if (type === C_TYPE_NATIVE)
                                isAdInviewFinished();
                            else if (type === C_TYPE_MOVIE)
                                isAdMovieNativeInviewFinished()
                    }, 1E3)
            }
            function clearAdTimer(ad) {
                if (ad.timerId) {
                    clearTimeout(ad.timerId);
                    ad.timerId = null
                }
            }
            function isAdInviewFinished() {
                var beaconAllCreated = true;
                Array.prototype.forEach.call(Ids, function(wid) {
                    if (adObjs[wid] === undefined || !beaconAllCreated || isSingleSspBeacon[wid])
                        return;
                    for (var j = 0; j < adObjs[wid].length; j++)
                        if (!adObjs[wid][j].beaconCreated) {
                            beaconAllCreated = false;
                            break
                        }
                });
                if (beaconAllCreated) {
                    window.top.removeEventListener("scroll", registerAdTimer);
                    window.top.removeEventListener("adLoaded", registerAdTimer)
                }
            }
            function isAdMovieNativeInviewFinished() {
                var beaconAllCreated = true;
                Array.prototype.forEach.call(Ids, function(wid) {
                    if (adMovieObj[wid] === undefined || !beaconAllCreated)
                        return;
                    if (!adObjs[wid][0].beaconCreated)
                        beaconAllCreated = false
                });
                if (beaconAllCreated) {
                    window.top.removeEventListener("scroll", registerAdMovieNativeTimer);
                    window.top.removeEventListener("adLoaded", registerAdMovieNativeTimer)
                }
            }
            function isAmpInsideViewport(c, adCenter) {
                if (c.intersectionRect.height < 0)
                    return false;
                var vTop = 0;
                var vBot = c.intersectionRect.height;
                if (c.boundingClientRect.top < 0) {
                    vTop = Math.abs(c.boundingClientRect.top);
                    vBot += Math.abs(c.boundingClientRect.top)
                }
                return vTop <= adCenter && adCenter <= vBot
            }
            function isDfpAmpSafeFrameFixedSize() {
                for (var i = 0; i < Ids.length; i++)
                    if (dfpTypes[Ids[i]] !== DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                        return false;
                return true
            }
            function dfpAmpSafeFrameRegisterAdTimer(type) {
                window.context.observeIntersection(function(changes) {
                    changes.forEach(function(change) {
                        if (type === C_TYPE_NATIVE)
                            registerAdTimer(change);
                        else if (type === C_TYPE_MOVIE)
                            registerAdMovieNativeTimer(change)
                    })
                })
            }
            function getAdNodeContentTop(adNode, wid, dfpTypes) {
                if (dfpTypes === DFP_FRIENDLY_IFRAME)
                    return GMOADRW.getContentTopInsideIframe(wid, adNode);
                else
                    return GMOADRW.getContentTop(adNode)
            }
            function getAdNodeContentCenter(adNode, adNodeContentTop) {
                return Math.floor(adNodeContentTop + adNode.getBoundingClientRect().height / 2)
            }
            function isInside(dfpTypes, adCenter, c) {
                return isAmp === "1" || dfpTypes === DFP_AMP_SAFE_FRAME_FIXED_SIZE ? isAmpInsideViewport(c, adCenter) : GMOADRW.isInsideViewport(GMOADRW.getViewablePixel(), adCenter)
            }
            function addListener(type) {
                if (isAmp === "1")
                    window.addEventListener("message", function(event) {
                        if (event.source != window.parent || !event.data || event.data.sentinel != "amp" || event.data.type != "intersection")
                            return;
                        event.data.changes.forEach(function(change) {
                            if (type === C_TYPE_NATIVE)
                                registerAdTimer(change);
                            else if (type === C_TYPE_MOVIE)
                                registerAdMovieNativeTimer(change)
                        })
                    });
                else if (isDfpAmpSafeFrameFixedSize())
                    if (!window.context)
                        if (type === C_TYPE_NATIVE)
                            window.addEventListener("amp-windowContextCreated", dfpAmpSafeFrameRegisterAdTimer);
                        else {
                            if (type === C_TYPE_MOVIE)
                                window.addEventListener("amp-windowContextCreated", dfpAmpSafeFrameRegisterAdMovieNativeTimer)
                        }
                    else if (type === C_TYPE_NATIVE)
                        dfpAmpSafeFrameRegisterAdTimer();
                    else {
                        if (type === C_TYPE_MOVIE)
                            dfpAmpSafeFrameRegisterAdMovieNativeTimer()
                    }
                else if (type === C_TYPE_NATIVE) {
                    window.top.addEventListener("adLoaded", registerAdTimer);
                    window.top.addEventListener("scroll", registerAdTimer)
                } else if (type === C_TYPE_MOVIE) {
                    window.top.addEventListener("adLoaded", registerAdMovieNativeTimer);
                    window.top.addEventListener("scroll", registerAdMovieNativeTimer)
                }
            }
        },
        inviewLog: function(leadArticleId, widgetId, reqId) {
            function checkAndLogSSP(e) {
                for (var j = 0; j < sspBeacons.length; j++) {
                    var overlapped = isAmp === "1" || dfpTypes[widgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE ? GMOADRW.isAmpOverlapped(e, sspBeacons[j]) : GMOADRW.isOverlapped(GMOADRW.getPageRect(), sspBeacons[j]);
                    if (overlapped) {
                        var wi = sspBeacons[j][4];
                        if (sspBeaconUrls[wi] && sspBeaconUrls[wi].length > 0) {
                            sspBeaconUrls[wi].forEach(function(url) {
                                if (isAmp === "1" || dfpTypes[widgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                                    url = url.match(/^amp_/) ? url.substr(4).replace(/\{\{w\}\}/, e.boundingClientRect.top) : url;
                                GMOADRW.otherCreateBeacon(url)
                            });
                            delete sspBeaconUrls[wi];
                            sspBeacons.splice(j, 1);
                            j -= 1
                        }
                    }
                }
            }
            function checkAndLog(leadArticleId, widgetId, reqId, interChange) {
                if (typeof widgetId === "undefined" && gBeacons.length === GMOADRW.sumBeaconForWidgets(Ids))
                    Array.prototype.forEach.call(Ids, function(wid) {
                        GMOADRW.refreshBeacons(wid, gBeacons[0][5], gBeacons[0][6])
                    });
                checkAndLogSSP(interChange);
                for (var i = 0; i < gBeacons.length; i++) {
                    var overlapped = interChange ? GMOADRW.isAmpOverlapped(interChange, gBeacons[i]) : GMOADRW.isOverlapped(GMOADRW.getPageRect(), gBeacons[i]);
                    if (overlapped) {
                        var bi = gBeacons[i][3];
                        var bt = gBeacons[i][2];
                        if (typeof bi === "undefined" || typeof bt === "undefined")
                            continue;
                        var insele = gLogFrame.contentWindow.document.createElement("img");
                        if (typeof widgetId === "undefined") {
                            var li = gBeacons[i][5];
                            var wi = gBeacons[i][4];
                            var ri = gBeacons[i][6]
                        } else {
                            var li = leadArticleId;
                            var wi = widgetId;
                            var ri = reqId
                        }
                        if (bi === 1)
                            if (createdBeaconType1FlagMap[wi]) {
                                gBeacons.splice(i, 1);
                                i -= 1;
                                continue
                            } else
                                createdBeaconType1FlagMap[wi] = true;
                        insele.setAttribute("width", "1");
                        insele.setAttribute("height", "1");
                        insele.setAttribute("style", "display: none;");
                        insele.src = BASE_URL + INVIEW_URL + "?loc\x3d" + encodeURIComponent(d.location.href.toString()) + "\x26li\x3d" + encodeURIComponent(li) + "\x26wi\x3d" + wi + "\x26id\x3d" + cookieId + "\x26ri\x3d" + ri + "\x26r\x3d" + encodeURIComponent(d.referrer) + "\x26bi\x3d" + bi + "\x26bt\x3d" + bt + "\x26t\x3d" + (new Date).getTime();
                        gLogFrame.contentWindow.document.getElementsByTagName("body")[0].appendChild(insele);
                        gBeacons.splice(i, 1);
                        i -= 1
                    }
                }
            }
            function delayProc() {
                clearTimeout(timer);
                timer = setTimeout(checkAndLog, 100)
            }
            function dfpAmpSafeFrameCheckAndLog() {
                var dfpAmpSafeFrameTimer;
                window.context.observeIntersection(function(changes) {
                    changes.forEach(function(change) {
                        clearTimeout(dfpAmpSafeFrameTimer);
                        dfpAmpSafeFrameTimer = setTimeout(function() {
                            checkAndLog(leadArticleId, widgetId, reqId, change)
                        }, 100)
                    })
                })
            }
            if (isAmp === "1") {
                var ampTimer;
                window.addEventListener("message", function(event) {
                    if (event.source != window.parent || !event.data || event.data.sentinel != "amp" || event.data.type != "intersection")
                        return;
                    event.data.changes.forEach(function(change) {
                        clearTimeout(ampTimer);
                        ampTimer = setTimeout(function() {
                            checkAndLog(leadArticleId, widgetId, reqId, change)
                        }, 100)
                    })
                })
            } else if (dfpTypes[widgetId] === DFP_AMP_SAFE_FRAME_FIXED_SIZE)
                if (!window.context)
                    window.addEventListener("amp-windowContextCreated", dfpAmpSafeFrameCheckAndLog);
                else
                    dfpAmpSafeFrameCheckAndLog();
            else {
                window.top.addEventListener("scroll", delayProc);
                window.top.addEventListener("adLoaded", checkAndLogSSP);
                checkAndLog(leadArticleId, widgetId, reqId)
            }
        },
        getPageRect: function() {
            var y = window.top.pageYOffset || window.top.document.documentElement.scrollTop || window.top.document.body.scrollTop || 0;
            var h = window.top.innerHeight;
            return [y, y + h]
        },
        getBeaconPos: function(id, widgetId, leadArticleId, reqId) {
            var elArea = __.getLastWidgetNodeById(id);
            var bType = elArea.dataset.type;
            var bIndex = elArea.dataset.index;
            var y = 0;
            var h = elArea.offsetHeight;
            while (elArea.offsetParent !== null) {
                y += elArea.offsetTop;
                elArea = elArea.offsetParent
            }
            var parentOffsetTop = GMOADRW.getParentOffsetTop(widgetId) + GMOADRW.getBounceContentOffsetTop();
            y = y + parentOffsetTop;
            return [y, y + h, bType, bIndex, widgetId, leadArticleId, reqId]
        },
        isOverlapped: function(p, e) {
            return p[0] < e[1] && p[1] > e[0]
        },
        isAmpOverlapped: function(c, e) {
            var vTop = c.intersectionRect.top > 0 ? c.intersectionRect.top - c.boundingClientRect.top : 0;
            var vBot = vTop + c.intersectionRect.height;
            return vBot > e[0] && vTop < e[1]
        },
        getPreviewQuery: function() {
            var paramStr;
            if (isAmp === "1")
                paramStr = encodeURI(document.referrer).split("?")[1];
            else {
                var url = window.location.search;
                if (url !== "")
                    paramStr = url.slice(1)
            }
            if (paramStr !== undefined) {
                var querys = paramStr.split("\x26");
                for (var i = 0; i < querys.length; i++) {
                    q = querys[i].split("\x3d");
                    if (q[0] === PREVIEW_QUERY_STRING)
                        return q[1]
                }
            }
            return ""
        },
        getABTestPreviewQuery: function() {
            var paramStr;
            if (isAmp === "1")
                paramStr = encodeURI(document.referrer).split("?")[1];
            else {
                var url = window.location.search;
                if (url !== "")
                    paramStr = url.slice(1)
            }
            if (paramStr !== undefined) {
                var querys = paramStr.split("\x26");
                for (var i = 0; i < querys.length; i++) {
                    q = querys[i].split("\x3d");
                    if (q[0] === ABTEST_PREVIEW_QUERY_STRING)
                        return q[1]
                }
            }
            return ""
        },
        getQuery: function(param) {
            var url = window.location.search;
            var querys = url.slice(1).split("\x26");
            for (var i = 0; i < querys.length; i++) {
                var q = querys[i].split("\x3d");
                if (q[0] === param)
                    return q[1]
            }
            return ""
        },
        getQueryValue: function(url, param) {
            var queryStr = url.split("?")[1];
            var querys = queryStr.slice(1).split("\x26");
            for (var i = 0; i < querys.length; i++) {
                var q = querys[i].split("\x3d");
                if (q[0] === param)
                    return q[1]
            }
            return ""
        },
        policy: function() {
            window.open(TAXEL_POLICY, "_blank")
        },
        switchLogo: function(widgetNode) {
            var container = widgetNode.getElementsByClassName("_taxel_recommend_articles")[0];
            var logo = widgetNode.getElementsByClassName("_taxel_recommend_credit_image")[0];
            var widgetTouchFlag = true;
            if (logo != null) {
                container.addEventListener("touchstart", function() {
                    logo.style.backgroundPosition = "0 -17.55px"
                });
                container.addEventListener("touchend", function() {
                    if (widgetTouchFlag) {
                        widgetTouchFlag = false;
                        setTimeout(function() {
                            logo.style.backgroundPosition = "0 0";
                            widgetTouchFlag = true
                        }, 2E3)
                    }
                })
            }
        },
        changeAdArticle: function(widgetNode, spaceId) {
            var elementArticle = widgetNode.getElementsByClassName("_taxel_recommend_article");
            var allElementAd = widgetNode.getElementsByClassName("_taxel_ad_article_" + spaceId);
            var elementAd = [];
            for (var i = 0; i < allElementAd.length; i++)
                if ((" " + allElementAd[i].className + " ").indexOf("_not_shuffle_target_ ") == -1)
                    elementAd.push(allElementAd[i]);
            var artLength = elementArticle.length;
            var adLength = elementAd.length;
            for (var i = 0; i < artLength; i++)
                if ((" " + elementArticle[i].className + " ").indexOf(" _shuffle_target_ ") == -1)
                    elementArticle[i].className += " _shuffle_target_";
            for (var i = 0; i < adLength; i++)
                if ((" " + elementAd[i].className + " ").indexOf(" _shuffle_target_ ") == -1 && (" " + elementAd[i].className + " ").indexOf("_not_shuffle_target_ ") == -1)
                    elementAd[i].className += " _shuffle_target_";
            var allElements = widgetNode.getElementsByClassName("_shuffle_target_");
            for (var i = 0; i < allElements.length; i++)
                allElements[i].setAttribute("org-idx", i.toString());
            var sameWidthGroup = [];
            for (var i = 0; i < adLength; i++)
                if (elementAd[i].clientWidth > 0) {
                    var orgIndex = elementAd[i].getAttribute("org-idx");
                    var adArtGroup = {
                        "ad_org_idx": parseInt(orgIndex),
                        "art_org_idx": []
                    };
                    for (var j = 0; j < artLength; j++)
                        if (elementArticle[j].clientWidth > 0 && elementArticle[j].parentNode.clientWidth == elementAd[i].parentNode.clientWidth) {
                            var artOrgIndex = parseInt(elementArticle[j].getAttribute("org-idx"));
                            adArtGroup["art_org_idx"].push(artOrgIndex)
                        }
                    if (adArtGroup["art_org_idx"].length > 0)
                        sameWidthGroup.push(adArtGroup)
                }
            var selArray = [];
            if (this.adArtShuffle(selArray, sameWidthGroup)) {
                var changedAdCnt = 0;
                for (var i = 0; i < selArray.length; i++)
                    if (selArray[i] != sameWidthGroup[i]["ad_org_idx"]) {
                        changedAdCnt++;
                        var adElement = widgetNode.querySelector('[org-idx\x3d"' + sameWidthGroup[i]["ad_org_idx"].toString() + '"]');
                        var articleElement = widgetNode.querySelector('[org-idx\x3d"' + selArray[i].toString() + '"]');
                        var targetArticle = articleElement.parentNode.innerHTML;
                        var targetAd = adElement.parentNode.innerHTML;
                        var articleAttributes = [];
                        var adAttributes = [];
                        for (var j = articleElement.parentNode.attributes.length - 1; j >= 0; j--)
                            articleAttributes.push({
                                "name": articleElement.parentNode.attributes[j].name,
                                "value": articleElement.parentNode.attributes[j].value
                            });
                        for (var j = adElement.parentNode.attributes.length - 1; j >= 0; j--)
                            adAttributes.push({
                                "name": adElement.parentNode.attributes[j].name,
                                "value": adElement.parentNode.attributes[j].value
                            });
                        for (var j = articleElement.parentNode.attributes.length - 1; j >= 0; j--)
                            articleElement.parentNode.removeAttributeNode(articleElement.parentNode.attributes[j]);
                        for (var j = adElement.parentNode.attributes.length - 1; j >= 0; j--)
                            adElement.parentNode.removeAttributeNode(adElement.parentNode.attributes[j]);
                        for (var j = articleAttributes.length - 1; j >= 0; j--)
                            adElement.parentNode.setAttribute(articleAttributes[j]["name"], articleAttributes[j]["value"]);
                        for (var j = adAttributes.length - 1; j >= 0; j--)
                            articleElement.parentNode.setAttribute(adAttributes[j]["name"], adAttributes[j]["value"]);
                        adElement.parentNode.innerHTML = targetArticle;
                        articleElement.parentNode.innerHTML = targetAd
                    }
                if (changedAdCnt > 0) {
                    var widgetNodeIdString = widgetNode.id;
                    var widgetNodeId = widgetNodeIdString.substring(7);
                    for (var i = 0; i < adObjs[widgetNodeId].length; i++) {
                        var ad_org_idx = adObjs[widgetNodeId][i].nodeObj.getAttribute("org-idx");
                        if (ad_org_idx)
                            adObjs[widgetNodeId][i].nodeObj = widgetNode.querySelector('[org-idx\x3d"' + ad_org_idx + '"]')
                    }
                }
                if (GMOADRW.hasClientCallValue(spaceId) && changedAdCnt > 0) {
                    var clientCallValue = GMOADRW.getClientCallValue(spaceId);
                    for (var networkId in clientCallValue)
                        for (var i = 0; i < clientCallValue[networkId].adDocument.length; i++) {
                            var ad_org_idx = clientCallValue[networkId].adDocument[i].getAttribute("org-idx");
                            if (ad_org_idx)
                                clientCallValue[networkId].adDocument[i] = widgetNode.querySelector('[org-idx\x3d"' + ad_org_idx + '"]')
                        }
                }
            }
            if (layzrEnable)
                layzr.update().check()
        },
        adArtShuffle: function(selArray, sameWidthGroup) {
            if (selArray.length === sameWidthGroup.length)
                return true;
            var next = selArray.length;
            var newIndex = null;
            var candidateIndex = sameWidthGroup[next]["art_org_idx"].slice();
            candidateIndex.push(sameWidthGroup[next]["ad_org_idx"]);
            var shuffledArticles = this.shuffle(candidateIndex);
            for (var i = 0; i < shuffledArticles.length; i++) {
                newIndex = shuffledArticles[i];
                if (!this.newIndexInvalid(next, newIndex, selArray, sameWidthGroup)) {
                    selArray.push(newIndex);
                    if (this.adArtShuffle(selArray, sameWidthGroup))
                        return true;
                    selArray.pop()
                }
            }
            return false
        },
        newIndexInvalid: function(next, newIndex, selArray, sameWidthGroup) {
            for (var selCnt = 0; selCnt < selArray.length; selCnt++)
                if (newIndex <= selArray[selCnt])
                    return true;
            for (var groupCnt = next + 1; groupCnt < sameWidthGroup.length; groupCnt++) {
                var canCnt = 0;
                var nextCandidateIndex = sameWidthGroup[groupCnt]["art_org_idx"].slice();
                nextCandidateIndex.push(sameWidthGroup[groupCnt]["ad_org_idx"]);
                for (canCnt = 0; canCnt < nextCandidateIndex.length; canCnt++)
                    if (newIndex < nextCandidateIndex[canCnt])
                        break;
                if (canCnt == nextCandidateIndex.length)
                    return true
            }
            return false
        },
        shuffle: function(array) {
            var m = array.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t
            }
            return array
        },
        setupAnimateHandler: function(widgetNode, spaceId, animOpt, layzr) {
            var animClz = "_taxel_animate_" + animOpt;
            var aniEls = widgetNode.querySelectorAll("._taxel_recommend_article,._taxel_ad_article_" + spaceId);
            [].forEach.call(aniEls, function(el) {
                el.classList.add("_taxel_base_animate", animClz)
            });
            layzr.on("src:after", function(imEl) {
                if (!widgetNode.contains(imEl))
                    return;
                var aniEl = imEl.classList.contains("_taxel_recommend_art_img") ? __.findParentWithClass(imEl, "_taxel_recommend_article") : __.findParentWithClass(imEl, "_taxel_ad_article_" + spaceId);
                if (aniEl && aniEl.classList.contains(animClz))
                    aniEl.classList.remove(animClz)
            })
        },
        findAdMovieTag: function(widgetNode) {
            var spaceIds = [];
            var adMovies = widgetNode.getElementsByClassName("_taxel_ad_movie");
            for (var i = 0; i < adMovies.length; i++) {
                var content = adMovies[i].getElementsByClassName("_taxel_ad_movie_content")[0];
                var spaceId = content.getAttribute("data-id");
                adMovieObj.nodeObj[spaceId] = adMovies[i];
                spaceIds.push(spaceId);
                adMovies[i].style.display = "none"
            }
            return spaceIds
        },
        getContentTop: function(content) {
            var scrollTop = Math.floor(document.documentElement.scrollTop || document.body.scrollTop);
            var top = Math.floor(content.getBoundingClientRect().top + scrollTop);
            return top
        },
        getContentTopInsideIframe: function(widgetId, content) {
            var scrollTop = Math.floor(window.top.document.documentElement.scrollTop || window.top.document.body.scrollTop);
            var widgetIframe = widgetIframes[widgetId];
            var iframeTop = widgetIframe ? widgetIframe.getBoundingClientRect().top : 0;
            var top = Math.floor(content.getBoundingClientRect().top + iframeTop + scrollTop);
            return top
        },
        getIframeContainWidget: function() {
            var iframes = window.top.document.getElementsByTagName("iframe");
            var widgetIframe = null;
            for (var i = 0, len = iframes.length; i < len; i++) {
                widgetIframe = iframes[i];
                if (widgetIframe.contentWindow == window)
                    break
            }
            return widgetIframe
        },
        getParentOffsetTop: function(widgetId) {
            var parentOffsetTop = 0;
            if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME) {
                var widgetIframe = widgetIframes[widgetId];
                if (widgetIframe)
                    parentOffsetTop = widgetIframe.offsetTop
            }
            return parentOffsetTop
        },
        getBounceContentOffsetTop: function() {
            var offset = 0;
            if (!document.getElementById("dokuryoBounceContent"))
                return 0;
            wt = window.top;
            offset = parseInt(wt.document.getElementById("taxelDokuryoBounceElement").getBoundingClientRect().top + wt.pageYOffset);
            return offset
        },
        setDokuryoRecommendAnimation: function(widgetId) {
            var widget = document.getElementById("gmo_rw_" + widgetId);
            var articles = widget.getElementsByClassName("_taxel_recommend_articles")[0];
            if (articles == undefined) {
                window.parent.removeEventListener("scroll", dokuryoRecommendAnimationCallback);
                return
            }
            var animOpt = articles.getAttribute("data-animate");
            if (!GMOADRW.isBounceContent() || animOpt == null) {
                window.parent.removeEventListener("scroll", dokuryoRecommendAnimationCallback);
                return
            }
            var insideWidgetTop = GMOADRW.getPageRect()[1] > GMOADRW.getBounceContentOffsetTop();
            var insideWidgetBottom = GMOADRW.getPageRect()[0] < GMOADRW.getBounceContentOffsetTop() + widget.getBoundingClientRect().height;
            if (insideWidgetTop && insideWidgetBottom) {
                articles.classList.add("_taxel_base_animate");
                articles.classList.add("_taxel_animate_" + animOpt);
                window.parent.removeEventListener("scroll", dokuryoRecommendAnimationCallback)
            }
        },
        setDokuryoRecommendOverlay: function() {
            var wt = window.top;
            var iFramePos = wt.document.getElementById("taxelDokuryoBounceElement").getBoundingClientRect().top;
            var insideWidgetTop = GMOADRW.getPageRect()[1] > iFramePos;
            var insideWidgetBottom = GMOADRW.getPageRect()[0] < iFramePos;
            if (insideWidgetTop && insideWidgetBottom) {
                var bounceIframe = window.parent.document.getElementById("taxelDokuryoBounceElement");
                bounceIframe.style.position = "fixed";
                bounceIframe.style.bottom = "0";
                bounceIframe.style.left = "0";
                bounceIframe.style.opacity = "1";
                bounceIframe.style.transition = ".5s linear";
                bounceIframe.style.zIndex = "999999999999";
                bounceIframe.style.visibility = "visible";
                window.parent.removeEventListener("scroll", dokuryoRecommendOverlayCallback)
            }
        },
        getViewablePixel: function() {
            var clientHeight = Math.floor(window.top.document.documentElement.scrollTop || window.top.document.body.scrollTop);
            var vpx = clientHeight + window.top.innerHeight;
            return vpx
        },
        callAdMovieInviewURL: function(spaceId, adHeightPosition) {
            var beacons = adMovieObj.adObj[spaceId].iv_beacon;
            for (var i = 0; i < beacons.length; i++) {
                var url = beacons[i].replace(/\{\{w\}\}/, adHeightPosition);
                GMOADRW.otherCreateBeacon(url)
            }
            var resGmomAkFq = adMovieObj.adObj[spaceId].res_gmom_ak_fq;
            if (resGmomAkFq)
                __.setCookieValue(AKANE_FQ_COOKIE_NAME, resGmomAkFq, AKANE_FQ_EXPIRE_SECOND)
        },
        adMovieNearInview: function(spaceId) {
            if (adMovieObj.doneNearInview[spaceId])
                return;
            else
                adMovieObj.doneNearInview[spaceId] = true;
            var conId = TAXEL_AD_MOVIE_CT_ID + "_" + spaceId;
            var con = document.getElementById(conId);
            if (adMovieObj.adObj[spaceId].networkId !== AD_NEWSTV) {
                con.style.display = "block";
                con.height = con.clientWidth / 16 * 9
            }
            var content = adMovieObj.adObj[spaceId].html;
            if (typeof adMovieObj.adObj[spaceId].html_iframe === "undefined" || adMovieObj.adObj[spaceId].html_iframe) {
                var doc = con.contentDocument;
                if (adMovieObj.adObj[spaceId].networkId === AD_NEWSTV)
                    con.addEventListener("load", function() {
                        if (doc.body) {
                            doc.body.style.margin = "0";
                            var height = doc.body.scrollHeight || doc.documentElement.scrollHeight;
                            if (height > 0) {
                                adMovieObj.movieLoaded[spaceId] = true;
                                con.style.display = "block";
                                con.height = height
                            }
                        }
                    });
                doc.open();
                doc.write(content);
                doc.close()
            } else {
                var elements = GMOADRW.getElements(content);
                for (var i = 0; i < elements.length; i++)
                    if (elements[i].nodeName.toLowerCase() == "script") {
                        sc = d.createElement("script");
                        var attrs = elements[i].attributes;
                        for (var j = 0; j < attrs.length; j++)
                            sc.setAttribute(attrs[j].name, attrs[j].value);
                        sc.innerHTML = elements[i].innerHTML;
                        con.appendChild(sc)
                    } else
                        con.appendChild(elements[i].cloneNode(true))
            }
        },
        adMovieInview: function(spaceId) {
            var node = adMovieObj.nodeObj[spaceId];
            var content = node.getElementsByClassName("_taxel_ad_movie_content")[0];
            var timerId;
            var delay = VIEWABLE_SEC * 1E3;
            function startTimer() {
                if (!timerId)
                    timerId = setTimeout(function() {
                        var adHeightPosition = GMOADRW.getContentTop(node);
                        GMOADRW.callAdMovieInviewURL(spaceId, adHeightPosition);
                        window.removeEventListener("scroll", registerTimer);
                        window.removeEventListener("load", registerTimer)
                    }, delay)
            }
            function clearTimer() {
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null
                }
            }
            function registerTimer() {
                if (!adMovieObj.doneNearInview[spaceId])
                    return;
                if (adMovieObj.adObj[spaceId].networkId === AD_NEWSTV && !adMovieObj.movieLoaded[spaceId])
                    return;
                var node = adMovieObj.nodeObj[spaceId];
                var content = node.getElementsByClassName("_taxel_ad_movie_content")[0];
                var center = Math.floor(GMOADRW.getContentTop(content) + content.getBoundingClientRect().height / 2);
                if (GMOADRW.isInsideViewport(GMOADRW.getViewablePixel(), center))
                    startTimer();
                else
                    clearTimer()
            }
            window.addEventListener("load", registerTimer);
            window.addEventListener("scroll", registerTimer)
        },
        isInsideViewport: function(px, center) {
            return center <= px && px <= center + window.top.innerHeight
        },
        otherCreateBeacon: function(url) {
            var beacon = gLogFrame.contentWindow.document.createElement("img");
            beacon.setAttribute("width", "1");
            beacon.setAttribute("height", "1");
            beacon.setAttribute("style", "display: none;");
            beacon.src = url;
            gLogFrame.contentWindow.document.getElementsByTagName("body")[0].appendChild(beacon)
        },
        handleExternalScript: function(widgetNode, leadArticleId, widgetId) {
            var adCtns = widgetNode.getElementsByClassName(TAXEL_SC_CLZ);
            if (adCtns && adCtns.length > 0)
                __.executeScript(adCtns, leadArticleId, widgetId);
            var adsDivs = widgetNode.getElementsByClassName(TAXEL_ADS_CLZ);
            if (adsDivs && adsDivs.length > 0)
                __.executeDirectScriptTxt(adsDivs, widgetId)
        },
        getElements: function(html) {
            var txt = d.createElement("div");
            txt.innerHTML = html;
            return txt.childNodes
        },
        insertDokuryoTag: function(dokuryoUnitKey, dokuryo) {
            var ele1 = d.createElement("script");
            ele1.src = DOKURYOJS;
            ele1.type = "text/javascript";
            ele1.charset = "utf-8";
            ele1.onload = function() {
                window.GMOAMReading = window.GMOAMReading || {};
                window.GMOAMReading.commands = GMOAMReading.commands || [];
                window.GMOAMReading.commands.push(function(loader) {
                    config = loader.forUnitKey(dokuryoUnitKey);
                    if (dokuryo && dokuryo.contentSelector)
                        config.setContentSelector(dokuryo.contentSelector)
                })
            }
            ;
            d.getElementsByTagName("head")[0].appendChild(ele1)
        },
        insertImuidTag: function() {
            var ele1 = d.createElement("script");
            ele1.src = IM_UID_JS;
            ele1.type = "text/javascript";
            ele1.charset = "utf-8";
            d.getElementsByTagName("head")[0].appendChild(ele1)
        },
        addHandPointerCss: function() {
            let creditsCollections = document.getElementsByClassName("_taxel_recommend_credit");
            if (creditsCollections.length === 0)
                return;
            let credits = Array.from(creditsCollections);
            credits.map(c=>c.style.cursor = "pointer")
        },
        insertBouncePosRecommend: function(dokuryoBounceRecommend, dokuryoBounceIndex, dokuryoUnitKey, dokuryoUseThreshold, dokuryoBounceBlacklist, dokuryoBounceBlacklistExtend, dokuryoBounceBlacklistExtendPixel, finishRate, bounceInsertType) {
            window.GMOAMReading = window.GMOAMReading || {};
            window.GMOAMReading.commands = GMOAMReading.commands || [];
            window.GMOAMReading.commands.push(function(loader) {
                if (!GMOADRW.validateBounceRecommendSetting(bounceInsertType, dokuryoBounceIndex, dokuryoUseThreshold))
                    return;
                var bounceId = "taxelDokuryoBounceElement";
                var bounceConfig = loader.forUnitKey(dokuryoUnitKey);
                const callback = function(e) {
                    if (bounceInsertType === BOUNCE_INSERT_TYPE_INDEX && e.detail.pixelCounter !== dokuryoBounceIndex)
                        return;
                    if (isAmp) {
                        if (isDokuryoRecommend)
                            return;
                        var ampIndexOf = dokuryoBounceRecommend.indexOf('data-page"amp"');
                        if (ampIndexOf)
                            dokuryoBounceRecommend = dokuryoBounceRecommend.replace('data-page\x3d"amp"', 'data-page\x3d"amp" data-gmodr\x3d"true"')
                    } else if (!(window.parent.document.getElementById(bounceId) === null))
                        return;
                    const iframe = document.createElement("iframe");
                    iframe.scrolling = "no";
                    iframe.frameBorder = "0";
                    iframe.style.width = "100%";
                    iframe.style.display = "block";
                    iframe.height = "0";
                    iframe.id = bounceId;
                    function setHeight() {
                        const iframeDocument = iframe.contentDocument ? iframe.contentDocument : window.frames.document;
                        const height = Math.round(iframeDocument.getElementsByTagName("HTML")[0].getBoundingClientRect().height);
                        iframe.height = height.toString()
                    }
                    var execSetHeight = function() {
                        if (document.readyState === "complete" && iframe.style.visibility != "hidden") {
                            setHeight();
                            setTimeout(setHeight, 1E3);
                            clearInterval(timerId)
                        }
                    };
                    var timerId = setInterval(function() {
                        execSetHeight()
                    }, 100);
                    var overlayFlag = dokuryoBounceRecommend.indexOf("data-overlay") > 0;
                    if (overlayFlag) {
                        iframe.style.visibility = "hidden";
                        dokuryoRecommendOverlayCallback = function() {
                            GMOADRW.setDokuryoRecommendOverlay()
                        }
                        ;
                        window.parent.addEventListener("scroll", dokuryoRecommendOverlayCallback)
                    }
                    iframe.addEventListener("load", loader);
                    e.detail.pixel.appendChild(iframe);
                    const iDoc = iframe.contentWindow.document;
                    if (typeof iDoc === "undefined")
                        return;
                    iDoc.open();
                    const iframeHTML = "\x3c!DOCTYPE html\x3e" + '\x3cdiv id \x3d "dokuryoBounceContent"\x3e \x3c/div\x3e\n' + dokuryoBounceRecommend + "\x3c/html\x3e";
                    iDoc.write(iframeHTML);
                    iDoc.close()
                };
                if (parseInt(finishRate) > 0)
                    bounceConfig.setFinishRateFilter(finishRate);
                if (bounceInsertType === BOUNCE_INSERT_TYPE_STAY_RATE)
                    bounceConfig.onBouncePercentage(dokuryoUseThreshold, callback);
                else
                    bounceConfig.onBouncePosition(callback);
                if (dokuryoBounceBlacklist)
                    bounceConfig.setRecommendBlacklistSelector(dokuryoBounceBlacklist, dokuryoBounceBlacklistExtend, dokuryoBounceBlacklistExtendPixel);
                bounceConfig.setIgnoredQueryParams(["rpvw"])
            })
        },
        validateBounceRecommendSetting: function(bounceInsertType, dokuryoBounceIndex, dokuryoUseThreshold) {
            try {
                var type = bounceInsertType || BOUNCE_INSERT_TYPE_INDEX;
                var index = parseInt(dokuryoBounceIndex);
                var stayRate = parseInt(dokuryoUseThreshold);
                if (type !== BOUNCE_INSERT_TYPE_INDEX && type !== BOUNCE_INSERT_TYPE_STAY_RATE)
                    return false;
                if (type === BOUNCE_INSERT_TYPE_INDEX && index < 1)
                    return false;
                if (type === BOUNCE_INSERT_TYPE_STAY_RATE && (stayRate < 0 || 100 < stayRate))
                    return false;
                return true
            } catch (e) {
                return false
            }
        },
        createBeaconForAdRenderCallback: function(impressionUrls, adDiv) {
            if (typeof impressionUrls === "string")
                impressionUrls = [impressionUrls];
            impressionUrls.forEach(function(impressionUrl) {
                var beacon = d.createElement("img");
                if (isAmp)
                    impressionUrl += "\x26ref\x3d" + GMOADRW.getEncodedReferrer();
                beacon.src = impressionUrl;
                beacon.width = "1";
                beacon.height = "1";
                beacon.setAttribute("style", "position:absolute;width:1px;height:1px;top:-16888px;left:-16888px");
                GMOADRW.insertAfter(beacon, adDiv)
            })
        },
        getHostName: function(url) {
            var parser = document.createElement("a");
            parser.href = url;
            return parser.hostname
        },
        isDspNetworkId: function(networkId) {
            return LOWER_DSP_NUM <= networkId && networkId <= UPPER_DSP_NUM
        },
        addClassToDspArticleForNative: function(networkId, widgetId, spaceId, articleIndex) {
            if (!GMOADRW.isDspNetworkId(networkId))
                return;
            var widgetNode = document.getElementById("gmo_rw_" + widgetId);
            if (widgetNode == null)
                return;
            var articles = widgetNode.getElementsByClassName("_taxel_ad_article_" + spaceId);
            if (articles == null || articles.length === 0)
                return;
            GMOADRW.addClassToDspArticle(articles, articleIndex)
        },
        addClassToDspArticleForMovieNative: function(articles) {
            GMOADRW.addClassToDspArticle(articles, 0)
        },
        addClassToDspArticle: function(articles, articleIndex) {
            articles[articleIndex].classList.add(AD_DSP_CLASS);
            var cssNames = ["_taxel_ad_art_img", "_taxel_ad_art_img_2"];
            cssNames.forEach(function(cssName) {
                var artImg = articles[articleIndex].getElementsByClassName(cssName);
                if (artImg != null && artImg[0] != null)
                    artImg[0].style.cssText = artImg[0].style.cssText + "background-size: contain !important; border-radius: 0 !important"
            })
        },
        loadAmpContextLib: function() {
            if (isLoadAmpContextLib)
                return;
            if (!window.context && window.AMP_CONTEXT_DATA)
                try {
                    var ampContextScript = document.createElement("script");
                    ampContextScript.src = window.AMP_CONTEXT_DATA.ampcontextFilepath;
                    document.head.appendChild(ampContextScript);
                    isLoadAmpContextLib = true
                } catch (err) {}
            else
                isLoadAmpContextLib = true
        },
        cookieSyncReemoToGoogle: function() {
            var ifr = document.createElement("iframe");
            ifr.height = "0";
            ifr.src = COOKIE_SYNC_REEMO_TO_GOOGLE_URL;
            ifr.style.position = "absolute";
            ifr.style.top = "-999px";
            ifr.style.left = "-999px";
            var body = document.querySelector("body");
            body.appendChild(ifr)
        },
        cookieSyncGMOSSPToDSP: function() {
            var ifr = document.createElement("iframe");
            ifr.height = "0";
            ifr.src = COOKIE_SYNC_GMOSSP_TO_DSP_URL;
            ifr.style.position = "absolute";
            ifr.style.top = "-999px";
            ifr.style.left = "-999px";
            var body = document.querySelector("body");
            body.appendChild(ifr)
        },
        getClientCallValue: function(spaceId) {
            return clientCallObjs[spaceId] || {}
        },
        hasClientCallValue: function(spaceId) {
            var clientCallValue = clientCallObjs[spaceId];
            return clientCallValue != null
        },
        countRwjs: function() {
            var oldJsName = /.*\/taxel.jp\/rw\.js.*/;
            var cdnJsName = /cdn\.taxel.jp\/[0-9]+\/rw\.js/;
            var scripts = document.getElementsByTagName("script");
            if (scripts.length == 0)
                return;
            var jsCount = 0;
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].getAttribute("src") == null)
                    continue;
                if (scripts[i].getAttribute("src").match(oldJsName) || scripts[i].getAttribute("src").match(cdnJsName))
                    jsCount++
            }
            return jsCount
        },
        widgetMonitor: function() {
            var widgetIds = Object.keys(allWidgetStatus);
            var completeString = "Completed";
            widgetIds.forEach(function(widgetId) {
                var state = allWidgetStatus[widgetId];
                if (state.status === completeString)
                    return;
                var divTag = getWidget(widgetId);
                var links = divTag.querySelectorAll("._taxel_recommend_article \x3e a, [class^\x3d_taxel_ad_article_] \x3e a");
                var filledLink = Array.prototype.every.call(links, function(link) {
                    return isCorrectLink(link)
                });
                if (!filledLink) {
                    GMOADRW.setWidgetStatus(widgetId, "Blank link.");
                    return
                }
                var titles = divTag.querySelectorAll("._taxel_ad_title, ._taxel_ad_art_title, ._taxel_ad_description, ._taxel_recommend_art_title");
                var filledTitle = Array.prototype.every.call(titles, function(title) {
                    return isCorrectTitle(title)
                });
                if (!filledTitle) {
                    GMOADRW.setWidgetStatus(widgetId, "Blank title.");
                    return
                }
                var images = divTag.querySelectorAll("._taxel_ad_art_img, ._taxel_recommend_art_img");
                var filledImage = Array.prototype.every.call(images, function(image) {
                    return isCorrectImage(image)
                });
                if (!filledImage) {
                    GMOADRW.setWidgetStatus(widgetId, "Blank image.");
                    return
                }
                GMOADRW.setWidgetStatus(widgetId, completeString)
            });
            if (widgetIds.length > 0 && widgetIds.every(function(widgetId) {
                return allWidgetStatus[widgetId].status === completeString
            })) {
                var completedTaxel = new CustomEvent("widgetMonitorCompleted");
                window.dispatchEvent(completedTaxel)
            } else {
                monitorTime++;
                if (monitorTime >= 10)
                    widgetIds.forEach(function(widgetId) {
                        if (allWidgetStatus[widgetId].status === completeString)
                            return;
                        if (isLayzrBlankImage(widgetId))
                            return;
                        if (hasAd(widgetId))
                            checkBlankAd(widgetId);
                        if (location.href.includes("rpvw\x3d"))
                            return;
                        var message = encodeURIComponent(allWidgetStatus[widgetId].status);
                        var rand = Math.random();
                        if (rand < .01)
                            GMOADRW.sendWidgetLog(widgetId, WLOG_STATUS_BLANK, message, __.getArticleIdResource())
                    });
                else
                    setTimeout(function() {
                        GMOADRW.widgetMonitor()
                    }, 1E3)
            }
            function hasAd(widgetId) {
                var divTag = getWidget(widgetId);
                var adLinks = divTag.querySelectorAll("[class^\x3d_taxel_ad_article_] \x3e a");
                var countLinks = 0;
                Array.prototype.every.call(adLinks, function(link) {
                    if (isCorrectLink(link))
                        countLinks++
                });
                var adTitles = divTag.querySelectorAll("._taxel_ad_title, ._taxel_ad_art_title, ._taxel_ad_description");
                var countTitles = 0;
                Array.prototype.every.call(adTitles, function(title) {
                    if (isCorrectTitle(title))
                        countTitles++
                });
                var adImages = divTag.querySelectorAll("._taxel_ad_art_img");
                var countImages = 0;
                Array.prototype.every.call(adImages, function(image) {
                    if (isCorrectImage(image))
                        countImages++
                });
                return countLinks > 0 || countTitles > 0 || countImages > 0
            }
            function checkBlankAd(widgetId) {
                var widget = getWidget(widgetId);
                var ads = widget.querySelectorAll("div[class^\x3d'_taxel_ad_article']");
                var blankAdCount = 0;
                ads.forEach(function(ad) {
                    var link = ad.querySelector("div[class^\x3d_taxel_ad_article_] \x3e a");
                    var title = ad.querySelector("._taxel_ad_title, ._taxel_ad_art_title, ._taxel_ad_description");
                    var image = ad.querySelector("._taxel_ad_art_img");
                    if (!isCorrectLink(link) || !isCorrectTitle(title) || !isCorrectImage(image))
                        blankAdCount++
                });
                if (blankAdCount > 0)
                    GMOADRW.setWidgetStatus(widgetId, "Partially missing ads. BlankAdCount: " + blankAdCount)
            }
            function getWidget(widgetId) {
                var divTag = __.getLastWidgetNodeById("gmo_rw_" + widgetId);
                if (!divTag)
                    return;
                return divTag
            }
            function isCorrectLink(link) {
                if (!link)
                    return false;
                if (link.closest("._taxel_ad_movie") || getComputedStyle(link).display == "none")
                    return true;
                return link.href !== document.location.href
            }
            function isCorrectTitle(title) {
                if (!title)
                    return false;
                if (title.closest("._taxel_ad_movie") || getComputedStyle(title).display == "none")
                    return true;
                return title.textContent !== ""
            }
            function isCorrectImage(image) {
                if (!image || image.getAttribute("data-layzr-normal"))
                    return false;
                if (image.closest("._taxel_ad_movie") || getComputedStyle(image).display == "none")
                    return true;
                let backgroundImage = getComputedStyle(image).backgroundImage;
                let extension = backgroundImage.replace(/^url\(["']?/, "").replace(/["']?\)$/, "").split(".").pop();
                if (extension == "html")
                    return false;
                return backgroundImage !== "none" && backgroundImage !== ""
            }
            function isLayzrBlankImage(widgetId) {
                var widget = getWidget(widgetId);
                var ads = widget.querySelectorAll("div[class^\x3d'_taxel_ad_article']");
                var blankLayzrImage = false;
                ads.forEach(function(ad) {
                    var image = ad.querySelector("._taxel_ad_art_img, ._taxel_ad_art_img_2");
                    if (!image)
                        return;
                    if (!isCorrectImage(image) && image.getAttribute("data-layzr-normal"))
                        blankLayzrImage = true
                });
                return blankLayzrImage
            }
        },
        setWidgetStatus: function(widgetId, status) {
            allWidgetStatus[widgetId] = allWidgetStatus[widgetId] || {};
            allWidgetStatus[widgetId].status = status
        },
        sendWidgetLog: function(widgetId, status, message, url) {
            var element = document.createElement("img");
            var insNode = document.getElementById("gmo_rw_" + widgetId);
            element.setAttribute("width", "1");
            element.setAttribute("height", "1");
            element.setAttribute("style", "display: none;");
            element.src = BASE_URL + WLOG_URL + "?wid\x3d" + widgetId + "\x26s\x3d" + status + "\x26m\x3d" + message + "\x26url\x3d" + url;
            insNode.parentNode.insertBefore(element, insNode)
        },
        getImageUrls: function(ad) {
            var imageUrls = {
                "imageUrl": ad.imageUrl,
                "ImageUrlSmall": ad.ImageUrlSmall,
                "imageUrl2": ad.imageUrl2,
                "ImageUrl2Small": ad.ImageUrl2Small
            };
            return imageUrls
        },
        displayYdaAd: function(widgetId, divs, ads, taxelClickUrls, sspClickurls) {
            let externalScripts = [];
            let normalScripts = [];
            for (let i = 0; i < ads.length; i++) {
                let d = divs[i];
                let ad = ads[i];
                let adDiv = document.createElement("div");
                adDiv.className = "taxel_yda";
                adDiv.style.zIndex = -1;
                adDiv.innerHTML = ad.html;
                d.classList.add("taxel_skelton");
                d.appendChild(adDiv);
                adDiv.querySelectorAll("script").forEach(scriptElement=>{
                    scriptElement.src ? externalScripts.push(scriptElement) : normalScripts.push(scriptElement)
                }
                )
            }
            let allScripts = externalScripts.concat(normalScripts);
            if (allScripts.length > 0)
                loadYdaScripts(allScripts);
            let adTaxels = document.querySelectorAll(`#gmo_rw_${widgetId} [id^='adtaxel']`);
            for (let i = 0; i < adTaxels.length; i++) {
                let adTaxel = adTaxels[i];
                let sspClickUrl = sspClickurls[i];
                let taxelClickUrl = taxelClickUrls[i];
                let config = {
                    childList: true,
                    characterData: true,
                    characterDataOldValue: true,
                    attributes: true,
                    subtree: true
                };
                let observer = new MutationObserver(function() {
                    let clickUrl = createClickUrl(widgetId, adTaxel, taxelClickUrl);
                    const skelton = adTaxel.closest(".taxel_skelton");
                    if (skelton) {
                        skelton.querySelector('a[href\x3d""]').remove();
                        skelton.querySelector(".taxel_yda").style.zIndex = null;
                        skelton.classList.remove("taxel_skelton")
                    }
                    if (clickUrl) {
                        observer.disconnect();
                        adTaxel.addEventListener("click", {
                            div: adTaxel,
                            taxelClickUrl: clickUrl,
                            sspClickUrl: sspClickUrl,
                            handleEvent: appendClickUrlScript
                        })
                    }
                }
                );
                observer.observe(adTaxel, config)
            }
            function loadYdaScripts(scripts) {
                if (scripts.length > 0) {
                    let targetScript = scripts.shift();
                    let newScript = document.createElement("script");
                    if (targetScript.async)
                        newScript.async = true;
                    newScript.type = targetScript.type;
                    newScript.textContent = targetScript.textContent;
                    if (targetScript.src) {
                        newScript.src = targetScript.src;
                        newScript.onload = function() {
                            loadYdaScripts(scripts)
                        }
                        ;
                        targetScript.replaceWith(newScript)
                    } else {
                        targetScript.replaceWith(newScript);
                        loadYdaScripts(scripts)
                    }
                }
            }
            function createClickUrl(widgetId, adTaxel, taxelClickUrl) {
                let adItem = adTaxel.querySelector(".yads_ad_item");
                if (!adItem)
                    return false;
                let regExp = new RegExp("u\x3d" + DAMMY_CLICK_URL);
                return taxelClickUrl.replace(regExp, "u\x3d" + encodeURIComponent(adItem.href + "\x26gmorw_ptn\x3d" + __.getCookieValue(PATTERN_ID_COOKIE_NAME + widgetId)))
            }
            function appendClickUrlScript(e) {
                appendScript(this.div, this.taxelClickUrl);
                appendScript(this.div, this.sspClickUrl)
            }
            function appendScript(parentDiv, src) {
                let newScript = document.createElement("script");
                newScript.type = "text/javascript";
                newScript.src = src;
                parentDiv.appendChild(newScript)
            }
        },
        isBlankAd: function(ad) {
            return Object.keys(ad).length === 0
        }
    };
    __.findParentWithClass = function(el, clzz) {
        while (el && el.parentNode) {
            el = el.parentNode;
            if (el.classList && el.classList.contains(clzz))
                return el
        }
        return null
    }
    ;
    __.isPosInt = function(num) {
        var x;
        if (isNaN(num))
            return false;
        x = parseFloat(num);
        return (x | 0) === x && x >= 0
    }
    ;
    __.isElNearViewport = function(el, widgetId) {
        var rect = el.getBoundingClientRect();
        var elementRectTop = rect.top;
        var elementRectBottom = rect.bottom;
        var wHeight = 0;
        var viewportTop = 0;
        if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME) {
            wHeight = window.top.innerHeight || window.top.document.documentElement.clientHeight;
            viewportTop = window.top.pageYOffset || window.top.document.documentElement.scrollTop || window.top.document.body.scrollTop || 0;
            var widgetIframe = widgetIframes[widgetId];
            if (widgetIframe) {
                var iframeRect = widgetIframe.getBoundingClientRect();
                elementRectTop = elementRectTop + iframeRect.top;
                elementRectBottom = elementRectBottom + iframeRect.bottom
            }
        } else {
            wHeight = window.innerHeight || document.documentElement.clientHeight;
            viewportTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
        }
        var viewportBot = viewportTop + wHeight;
        var nearBeaconTop = elementRectTop + viewportTop - TAXEL_SCRIPT_NEAR_INVIEW_PX;
        var nearBeaconBot = elementRectBottom + viewportTop + TAXEL_SCRIPT_NEAR_INVIEW_PX;
        return elementRectTop >= 0 && viewportBot >= nearBeaconTop || elementRectTop < 0 && viewportTop <= nearBeaconBot
    }
    ;
    __.executeScript = function(scCtns, articleId, widgetId) {
        var scArr = Array.prototype.slice.call(scCtns);
        var timerId;
        var elNum = scArr.length;
        var numDone = 0;
        function eachExecuteScript(ctn) {
            var type = ctn.getAttribute("data-type");
            var responsiveMovie = ctn.getAttribute("data-responsive-movie");
            var ifr = document.createElement("iframe");
            var ifrId = TAXEL_IF_ID + "-" + articleId + "-" + i;
            ifr.scrolling = "no";
            ifr.frameBorder = "0";
            ifr.height = "0";
            if (type !== "1")
                ifr.style.display = "none";
            ifr.setAttribute("id", ifrId);
            ifr.classList ? ifr.classList.add(TAXEL_IF_CLZ) : ifr.className = TAXEL_IF_CLZ;
            var ctnParentNode = ctn.parentNode;
            ctnParentNode.replaceChild(ifr, ctn);
            var doc = ifr.contentDocument;
            ifr.addEventListener("load", function() {
                if (responsiveMovie) {
                    ifr.style.display = "block";
                    var movieContentHeight = 0;
                    var movieContent = doc.getElementsByClassName("_add_taxel_movie_content")[0];
                    if (movieContent) {
                        movieContent.style.cssText = "overflow: hidden !important;";
                        ctnParentNode.appendChild(movieContent);
                        movieContentHeight = ctnParentNode.getElementsByClassName("_add_taxel_movie_content")[0].getBoundingClientRect().height
                    }
                    ifr.width = "100%";
                    var ifrHeight = ifr.getBoundingClientRect().width / 16 * 9;
                    ifr.height = ifrHeight;
                    ctnParentNode.style.height = ifrHeight + movieContentHeight
                } else {
                    var lHeight = 0, nRun = 0, nHeight, heightChkTimer;
                    chkHeight();
                    function chkHeight() {
                        nHeight = doc.body.scrollHeight || doc.documentElement.scrollHeight;
                        if (lHeight !== nHeight) {
                            if (ifr.style.display === "none")
                                ifr.style.display = "block";
                            ifr.height = nHeight;
                            lHeight = nHeight
                        }
                        if (heightChkTimer)
                            clearTimeout(heightChkTimer);
                        if (++nRun < MAX_IF_TIMER_RUN)
                            heightChkTimer = setTimeout(chkHeight, IF_TIMEOUT)
                    }
                }
            });
            var content = '\x3cbody marginwidth\x3d"0" marginheight\x3d"0" \x3e\x3cbase target\x3d"_parent" /\x3e\x3cscript\x3ewindow.inDapIF \x3d true;\x3c/script\x3e' + ctn.innerHTML + "\x3c/body\x3e";
            doc.open();
            doc.write(content);
            doc.close()
        }
        function executeCallback() {
            clearTimeout(timerId);
            timerId = setTimeout(function() {
                for (var i = 0; i < scArr.length; i++)
                    if (__.isElNearViewport(scArr[i], widgetId) || bannerNearInviewEnable === 0) {
                        eachExecuteScript(scArr[i]);
                        scArr.splice(i--, 1);
                        if (++numDone === elNum)
                            if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME)
                                window.top.removeEventListener("scroll", executeCallback);
                            else
                                window.removeEventListener("scroll", executeCallback)
                    }
            }, 100)
        }
        if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME) {
            window.top.addEventListener("load", executeCallback);
            window.top.addEventListener("scroll", executeCallback)
        } else {
            window.addEventListener("load", executeCallback);
            window.addEventListener("scroll", executeCallback)
        }
    }
    ;
    __.executeDirectScriptTxt = function(parentEls, widgetId) {
        var prArr = Array.prototype.slice.call(parentEls);
        var timerId;
        var elNum = prArr.length;
        var numDone = 0;
        function isNodeNameEq(el, name) {
            return el.nodeName && el.nodeName.toUpperCase() === name.toUpperCase()
        }
        function createScriptEl(el) {
            var sc = document.createElement("script");
            var attrs = el.attributes;
            for (var i = 0, len = attrs.length; i < len; i++)
                sc.setAttribute(attrs[i].name, attrs[i].value);
            if (!el.src) {
                sc.type = "text/javascript";
                sc.textContent = el.textContent
            }
            return sc
        }
        function executeCallback() {
            clearTimeout(timerId);
            timerId = setTimeout(function() {
                for (var i = 0; i < prArr.length; i++) {
                    var pEl = prArr[i];
                    if (__.isElNearViewport(pEl, widgetId) || bannerNearInviewEnable === 0) {
                        var childNodes = pEl.childNodes;
                        for (var j = 0, len = childNodes.length; j < len; j++) {
                            var child = childNodes[j];
                            if (isNodeNameEq(child, "script") && (!child.type || child.type.toLowerCase() === "text/javascript"))
                                pEl.replaceChild(createScriptEl(child), child)
                        }
                        prArr.splice(i--, 1);
                        if (++numDone === elNum)
                            if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME)
                                window.top.removeEventListener("scroll", executeCallback);
                            else
                                window.removeEventListener("scroll", executeCallback)
                    }
                }
            }, 100)
        }
        if (dfpTypes[widgetId] === DFP_FRIENDLY_IFRAME) {
            window.top.addEventListener("load", executeCallback);
            window.top.addEventListener("scroll", executeCallback)
        } else {
            window.addEventListener("load", executeCallback);
            window.addEventListener("scroll", executeCallback)
        }
    }
    ;
    __.getCookieValue = function(ke) {
        var full_cookie_data = d.cookie;
        var array_cookies = full_cookie_data.split(";");
        for (var i = 0; i < array_cookies.length; i++) {
            var tmp = array_cookies[i].split("\x3d");
            var val = tmp[0].replace(/(^\s+)|(\s+$)/g, "");
            if (val == ke)
                return tmp[1]
        }
        return ""
    }
    ;
    __.setCookieValue = function(name, cookieValue, expire) {
        var date = new Date;
        date.setSeconds(date.getSeconds() + expire);
        d.cookie = name + "\x3d" + cookieValue + "; expires\x3d" + date.toGMTString() + "; path\x3d/" + ";"
    }
    ;
    __.hasCookie = function(name) {
        return d.cookie.indexOf(name + "\x3d") !== -1
    }
    ;
    __.addLeadArticleIdsCookie = function(leadArticleId) {
        if (!LEAD_ARTICLE_CACHE_NUM)
            return;
        var leadArticleIdArray = [];
        var leadArticleIds = __.getCookieValue(LEAD_ARTICLE_IDS_COOKIE_NAME);
        if (leadArticleIds)
            leadArticleIdArray = leadArticleIds.split(",");
        if (leadArticleIdArray.indexOf(leadArticleId) >= 0)
            return;
        leadArticleIdArray.push(leadArticleId);
        while (leadArticleIdArray.length > LEAD_ARTICLE_CACHE_NUM)
            leadArticleIdArray.shift();
        __.setCookieValue(LEAD_ARTICLE_IDS_COOKIE_NAME, leadArticleIdArray.join(","), LEAD_ARTICLE_IDS_COOKIE_EXPIRE_SECOND)
    }
    ;
    __.createWidgetScript = function(displayedIds) {
        var session = __.getCookieValue(SESSION_COOKIE_NAME + mediaId);
        var previewQueryVal = GMOADRW.getPreviewQuery();
        var addQueryVal = "";
        if (previewQueryVal !== "")
            addQueryVal += "\x26" + PREVIEW_QUERY_STRING + "\x3d" + previewQueryVal;
        var previewRandomQueryVal = GMOADRW.getQuery(RANDOM_QUERY_STRING);
        if (previewRandomQueryVal !== "")
            addQueryVal += "\x26" + RANDOM_QUERY_STRING + "\x3d" + previewRandomQueryVal;
        var optionalContent = __.getOptionalContent();
        if (optionalContent)
            addQueryVal += "\x26" + OPTIONAL_QUERY_STRING + "\x3d" + encodeURIComponent(optionalContent);
        var abtestPreviewQueryVal = GMOADRW.getABTestPreviewQuery();
        if (abtestPreviewQueryVal !== "")
            addQueryVal += "\x26" + ABTEST_PREVIEW_QUERY_STRING + "\x3d" + abtestPreviewQueryVal;
        var leadArticleIds = __.getCookieValue(LEAD_ARTICLE_IDS_COOKIE_NAME);
        if (leadArticleIds !== "")
            addQueryVal += "\x26" + LEAD_ARTICLE_IDS_QUERY_STRING + "\x3d" + encodeURIComponent(leadArticleIds);
        var insertTag = function(webpSupported) {
            var ele = d.createElement("script");
            ele.src = BASE_URL + TAG_URL + "?loc\x3d" + encodeURIComponent(d.location.href.toString()) + "\x26wi\x3d" + displayedIds + "\x26id\x3d" + cookieId + "\x26s\x3d" + session + "\x26t\x3d" + (new Date).getTime() + "\x26st\x3d" + (new Date).getTime() + "\x26rid\x3d" + requestId + "\x26air\x3d" + encodeURIComponent(articleIdRes) + "\x26r\x3d" + encodeURIComponent(d.referrer) + "\x26mid\x3d" + mediaId + addQueryVal;
            ele.async = true;
            ele.type = "text/javascript";
            var jsCount = GMOADRW.countRwjs();
            if (jsCount > 1)
                ele.src += "\x26djc\x3d" + jsCount;
            if (webpSupported)
                ele.src += "\x26webp\x3d" + 1;
            var insNode = __.getLastWidgetNodeById("gmo_rw_" + displayedIds[0]);
            insNode.parentNode.insertBefore(ele, insNode)
        };
        insertTagWithCheckWebp(insertTag);
        function insertTagWithCheckWebp(callback) {
            if (!window.createImageBitmap) {
                callback(false);
                return
            }
            var webpData = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA\x3d";
            fetch(webpData).then(function(response) {
                return response.blob()
            }).then(function(blob) {
                createImageBitmap(blob).then(function() {
                    callback(true)
                }, function() {
                    callback(false)
                })
            })
        }
        allWidgetStatus = allWidgetStatus || {};
        setTimeout(function() {
            GMOADRW.widgetMonitor()
        }, 1E3)
    }
    ;
    __.createNotFoundBeacon = function() {
        var notFoundUrl = BASE_URL + NOT_FOUND_URL + "?loc\x3d" + encodeURIComponent(__.taxel_url_replace(urlReplaceRules, location.href)) + "\x26mid\x3d" + mediaId;
        GMOADRW.otherCreateBeacon(notFoundUrl)
    }
    ;
    __.sendDummyRequest = function() {
        var session = __.getCookieValue(SESSION_COOKIE_NAME + DUMMY_MEDIA_ID);
        var time = (new Date).getTime();
        var ele = d.createElement("script");
        ele.src = BASE_URL + TAG_URL + "?loc\x3d" + encodeURIComponent(d.location.href.toString()) + "\x26wi\x3d" + DUMMY_WIDGET_ID + "\x26id\x3d" + cookieId + "\x26wgi\x3d\x26s\x3d" + session + "\x26t\x3d" + time + "\x26st\x3d" + time + "\x26rid\x3d" + requestId + "\x26air\x3d" + encodeURIComponent(articleIdRes) + "\x26r\x3d" + encodeURIComponent(d.referrer) + "\x26mid\x3d" + mediaId;
        ele.async = true;
        ele.type = "text/javascript";
        d.getElementsByTagName("head")[0].appendChild(ele)
    }
    ;
    __.getWidgetIds = function() {
        var divs = d.getElementsByTagName("div");
        if (Ids.length === 0)
            if (mediaId === "69")
                for (var i = 0, len = divs.length; i < len; i++) {
                    if (divs[i].id.match(/^gmo_rw_/)) {
                        var wId = divs[i].id.replace(/^gmo_rw_/g, "");
                        if (Ids.indexOf(wId) == -1)
                            Ids.push(wId)
                    }
                }
            else
                for (var i = 0, len = divs.length; i < len; i++)
                    if (divs[i].dataset.gmoad != null && divs[i].dataset.gmoad == "rw")
                        if (divs[i].id.match(/^gmo_rw_/)) {
                            var wId = divs[i].id.replace(/^gmo_rw_/g, "");
                            if (Ids.indexOf(wId) == -1)
                                Ids.push(wId)
                        }
        return Ids
    }
    ;
    __.getLastWidgetNodeById = function(widgetId) {
        var divs = d.getElementsByTagName("div");
        for (var i = divs.length - 1; i >= 0; i--)
            if (divs[i].id.match(widgetId))
                return divs[i];
        return null
    }
    ;
    __.getLastWidgetNodeBySpaceId = function(spaceId) {
        var divs = d.getElementsByClassName(spaceId);
        return divs[divs.length - 1]
    }
    ;
    __.getArticleIdResource = function() {
        if (notFoundNode != null)
            return location.href;
        if (isAmp === "1") {
            var meta = d.getElementsByTagName("meta");
            for (var i = 0; i < meta.length; i++)
                if (meta[i].getAttribute("property") == "og:url")
                    return meta[i].getAttribute("content");
            return ""
        } else if (window.AMP_CONTEXT_DATA && !window["$sf"])
            return document.referrer;
        var meta = d.getElementsByTagName("meta");
        var link = d.getElementsByTagName("link");
        switch (gmoArticleIdRule) {
        case 1:
            for (var i = 0; i < meta.length; i++)
                if (meta[i].getAttribute("property") == "og:url")
                    return meta[i].getAttribute("content");
            break;
        case 2:
            for (var i = 0; i < link.length; i++)
                if (link[i].getAttribute("rel") === "canonical")
                    return link[i].getAttribute("href");
            break;
        case 3:
            if ("href"in d.location)
                return location.href;
            break;
        case 4:
            for (var i = 0; i < meta.length; i++)
                if (meta[i].getAttribute("property") == "og:url")
                    return meta[i].getAttribute("content");
            if ("href"in d.location)
                return location.href;
            break;
        default:
            return ""
        }
        return ""
    }
    ;
    __.taxel_url_replace = function(replaceRules, url) {
        for (var regKey in replaceRules)
            if (replaceRules.hasOwnProperty(regKey))
                url = url.replace(new RegExp(regKey), replaceRules[regKey]);
        return url
    }
    ;
    __.taxel_link_completion = function(ogUrl) {
        if (ogUrl.substr(0, 2) == "//")
            return location.protocol + ogUrl;
        else if (ogUrl.substr(0, 1) == "/")
            return location.origin + ogUrl;
        return ogUrl
    }
    ;
    __.getOptionalContent = function() {
        var optContent = "";
        if (typeof crawlRule.optional !== "undefined" && typeof crawlRule.optional.tag !== "undefined") {
            var el$ = document.querySelector(crawlRule.optional.tag);
            if (el$ !== null) {
                if (typeof crawlRule.optional.attr !== "undefined")
                    optContent = el$.getAttribute(crawlRule.optional.attr);
                else
                    optContent = el$.innerText || el$.textContent;
                if (typeof crawlRule.optional.regex !== "undefined" && typeof crawlRule.optional.replacement !== "undefined")
                    optContent = optContent.replace(new RegExp(crawlRule.optional.regex,"g"), crawlRule.optional.replacement)
            }
        }
        return optContent
    }
    ;
    __.createAndGetBeaconFrame = function() {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("id", "gmorw_log");
        iframe.setAttribute("width", "1");
        iframe.setAttribute("height", "1");
        iframe.setAttribute("style", "display: none;");
        document.body.appendChild(iframe);
        return document.getElementById("gmorw_log")
    }
    ;
    __.loadCriteo = function() {
        var script = document.createElement("script");
        script.src = "https://static.criteo.net/js/ld/publishertag.js";
        d.getElementsByTagName("head")[0].appendChild(script);
        window.Criteo = window.Criteo || {};
        window.Criteo.events = window.Criteo.events || []
    }
    ;
    __.isChrome = function() {
        try {
            var userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("edge") != -1)
                return false;
            else if (userAgent.indexOf("chrome") != -1)
                return true
        } catch (e) {}
        return false
    }
    ;
    __.createRandomRangeNum = function(start, end) {
        return Math.floor(Math.random() * (end - start + 1) + start)
    }
    ;
    __.strRepeat = function(str, num) {
        return Array(num + 1).join(str)
    }
    ;
    __.createCookieId = function() {
        var uniqueId = md5(Math.random().toString() + (new Date).getTime().toString() + Math.random().toString());
        var randomNumStr = __.createRandomRangeNum(0, 99).toString();
        var userCookieId = randomNumStr + uniqueId;
        return randomNumStr.length === 2 ? userCookieId : __.strRepeat("0", 1) + userCookieId
    }
    ;
    __.canNearInviewLoadWidget = function(displayedIds) {
        for (var i = 0; i < displayedIds.length; i++)
            if (ENABLE_NEAR_INVIEW_LOAD_WIDGET_IDS.indexOf(parseInt(displayedIds[i])) === -1)
                return false;
        return true
    }
    ;
    __.discriminantUserAgent = function() {
        let userAgent = window.navigator.userAgent;
        if (userAgent.match(/Android/))
            return "Android";
        else if (userAgent.match(/iPhone|iPad/))
            return "iOS";
        else
            return "PC"
    }
    ;
    !function() {
        var n = ["ms", "moz", "webkit", "o"]
          , e = "AnimationFrame"
          , i = 0;
        "performance"in window == !1 && (window.performance = {}),
        Date.now || (Date.now = function() {
            return (new Date).getTime()
        }
        ),
        "now"in window.performance == !1 && !function() {
            var n = Date.now();
            performance.timing && performance.timing.navigationStart && (n = performance.timing.navigationStart),
            window.performance.now = function() {
                return Date.now() - n
            }
        }();
        for (var o = 0; o < n.length && !window.requestAnimationFrame; ++o) {
            var a = n[o];
            window.requestAnimationFrame = window[a + "Request" + e],
            window.cancelAnimationFrame = window[a + "Cancel" + e] || window[a + "CancelRequest" + e]
        }
        window.requestAnimationFrame || (window.requestAnimationFrame = function(n) {
            var e = Date.now()
              , o = Math.max(0, 16 - (e - i))
              , a = window.setTimeout(function() {
                return n(e + o)
            }, o);
            return i = e + o,
            a
        }
        ),
        window.cancelAnimationFrame || (window.cancelAnimationFrame = function(n) {
            return clearTimeout(n)
        }
        )
    }();
    !function(t, e) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Layzr = e()
    }(this, function() {
        var t = {};
        t["extends"] = Object.assign || function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var n = arguments[e];
                for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r])
            }
            return t
        }
        ;
        var e = function() {
            function e(t, e) {
                return c[t] = c[t] || [],
                c[t].push(e),
                this
            }
            function n(t, n) {
                return n._once = !0,
                e(t, n),
                this
            }
            function r(t) {
                var e = arguments.length <= 1 || void 0 === arguments[1] ? !1 : arguments[1];
                return e ? c[t].splice(c[t].indexOf(e), 1) : delete c[t],
                this
            }
            function i(t) {
                for (var e = this, n = arguments.length, i = Array(n > 1 ? n - 1 : 0), o = 1; n > o; o++)
                    i[o - 1] = arguments[o];
                var s = c[t] && c[t].slice();
                return s && s.forEach(function(n) {
                    n._once && r(t, n),
                    n.apply(e, i)
                }),
                this
            }
            var o = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0]
              , c = {};
            return t["extends"]({}, o, {
                on: e,
                once: n,
                off: r,
                emit: i
            })
        }
          , n = function() {
            function t() {
                return window.scrollY || window.pageYOffset
            }
            function n() {
                d = t(),
                r()
            }
            function r() {
                l || (requestAnimationFrame(function() {
                    return u()
                }),
                l = !0)
            }
            function i(t) {
                return t.getBoundingClientRect().top + d
            }
            function o(t) {
                var e = d
                  , n = e + v
                  , r = i(t)
                  , o = r + t.offsetHeight
                  , c = m.threshold / 100 * v;
                return o >= e - c && n + c >= r
            }
            function c(t) {
                if (w.emit("src:before", t),
                p && t.hasAttribute(m.srcset))
                    t.setAttribute("srcset", t.getAttribute(m.srcset));
                else {
                    var e = g > 1 && t.getAttribute(m.retina);
                    t.setAttribute("src", e || t.getAttribute(m.normal))
                }
                w.emit("src:after", t),
                [m.normal, m.retina, m.srcset].forEach(function(e) {
                    return t.removeAttribute(e)
                }),
                a()
            }
            function s(t) {
                var e = t ? "addEventListener" : "removeEventListener";
                return ["scroll", "resize"].forEach(function(t) {
                    return window[e](t, n)
                }),
                this
            }
            function u() {
                return v = window.innerHeight,
                h.forEach(function(t) {
                    return o(t) && c(t)
                }),
                l = !1,
                this
            }
            function a() {
                return h = Array.prototype.slice.call(document.querySelectorAll("[" + m.normal + "]")),
                this
            }
            var f = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0]
              , d = t()
              , l = void 0
              , h = void 0
              , v = void 0
              , m = {
                normal: f.normal || "data-normal",
                retina: f.retina || "data-retina",
                srcset: f.srcset || "data-srcset",
                threshold: f.threshold || 0
            }
              , p = document.body.classList.contains("srcset") || "srcset"in document.createElement("img")
              , g = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI
              , w = e({
                handlers: s,
                check: u,
                update: a
            });
            return w
        };
        return n
    });
    !function(n) {
        function d(n, t) {
            var r = (65535 & n) + (65535 & t);
            return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
        }
        function f(n, t, r, e, o, u) {
            return d(function(n, t) {
                return n << t | n >>> 32 - t
            }(d(d(t, n), d(e, u)), o), r)
        }
        function l(n, t, r, e, o, u, c) {
            return f(t & r | ~t & e, n, t, o, u, c)
        }
        function g(n, t, r, e, o, u, c) {
            return f(t & e | r & ~e, n, t, o, u, c)
        }
        function v(n, t, r, e, o, u, c) {
            return f(t ^ r ^ e, n, t, o, u, c)
        }
        function m(n, t, r, e, o, u, c) {
            return f(r ^ (t | ~e), n, t, o, u, c)
        }
        function i(n, t) {
            var r, e, o, u, c;
            n[t >> 5] |= 128 << t % 32,
            n[14 + (t + 64 >>> 9 << 4)] = t;
            var f = 1732584193
              , i = -271733879
              , a = -1732584194
              , h = 271733878;
            for (r = 0; r < n.length; r += 16)
                i = m(i = m(i = m(i = m(i = v(i = v(i = v(i = v(i = g(i = g(i = g(i = g(i = l(i = l(i = l(i = l(o = i, a = l(u = a, h = l(c = h, f = l(e = f, i, a, h, n[r], 7, -680876936), i, a, n[r + 1], 12, -389564586), f, i, n[r + 2], 17, 606105819), h, f, n[r + 3], 22, -1044525330), a = l(a, h = l(h, f = l(f, i, a, h, n[r + 4], 7, -176418897), i, a, n[r + 5], 12, 1200080426), f, i, n[r + 6], 17, -1473231341), h, f, n[r + 7], 22, -45705983), a = l(a, h = l(h, f = l(f, i, a, h, n[r + 8], 7, 1770035416), i, a, n[r + 9], 12, -1958414417), f, i, n[r + 10], 17, -42063), h, f, n[r + 11], 22, -1990404162), a = l(a, h = l(h, f = l(f, i, a, h, n[r + 12], 7, 1804603682), i, a, n[r + 13], 12, -40341101), f, i, n[r + 14], 17, -1502002290), h, f, n[r + 15], 22, 1236535329), a = g(a, h = g(h, f = g(f, i, a, h, n[r + 1], 5, -165796510), i, a, n[r + 6], 9, -1069501632), f, i, n[r + 11], 14, 643717713), h, f, n[r], 20, -373897302), a = g(a, h = g(h, f = g(f, i, a, h, n[r + 5], 5, -701558691), i, a, n[r + 10], 9, 38016083), f, i, n[r + 15], 14, -660478335), h, f, n[r + 4], 20, -405537848), a = g(a, h = g(h, f = g(f, i, a, h, n[r + 9], 5, 568446438), i, a, n[r + 14], 9, -1019803690), f, i, n[r + 3], 14, -187363961), h, f, n[r + 8], 20, 1163531501), a = g(a, h = g(h, f = g(f, i, a, h, n[r + 13], 5, -1444681467), i, a, n[r + 2], 9, -51403784), f, i, n[r + 7], 14, 1735328473), h, f, n[r + 12], 20, -1926607734), a = v(a, h = v(h, f = v(f, i, a, h, n[r + 5], 4, -378558), i, a, n[r + 8], 11, -2022574463), f, i, n[r + 11], 16, 1839030562), h, f, n[r + 14], 23, -35309556), a = v(a, h = v(h, f = v(f, i, a, h, n[r + 1], 4, -1530992060), i, a, n[r + 4], 11, 1272893353), f, i, n[r + 7], 16, -155497632), h, f, n[r + 10], 23, -1094730640), a = v(a, h = v(h, f = v(f, i, a, h, n[r + 13], 4, 681279174), i, a, n[r], 11, -358537222), f, i, n[r + 3], 16, -722521979), h, f, n[r + 6], 23, 76029189), a = v(a, h = v(h, f = v(f, i, a, h, n[r + 9], 4, -640364487), i, a, n[r + 12], 11, -421815835), f, i, n[r + 15], 16, 530742520), h, f, n[r + 2], 23, -995338651), a = m(a, h = m(h, f = m(f, i, a, h, n[r], 6, -198630844), i, a, n[r + 7], 10, 1126891415), f, i, n[r + 14], 15, -1416354905), h, f, n[r + 5], 21, -57434055), a = m(a, h = m(h, f = m(f, i, a, h, n[r + 12], 6, 1700485571), i, a, n[r + 3], 10, -1894986606), f, i, n[r + 10], 15, -1051523), h, f, n[r + 1], 21, -2054922799), a = m(a, h = m(h, f = m(f, i, a, h, n[r + 8], 6, 1873313359), i, a, n[r + 15], 10, -30611744), f, i, n[r + 6], 15, -1560198380), h, f, n[r + 13], 21, 1309151649), a = m(a, h = m(h, f = m(f, i, a, h, n[r + 4], 6, -145523070), i, a, n[r + 11], 10, -1120210379), f, i, n[r + 2], 15, 718787259), h, f, n[r + 9], 21, -343485551),
                f = d(f, e),
                i = d(i, o),
                a = d(a, u),
                h = d(h, c);
            return [f, i, a, h]
        }
        function a(n) {
            var t, r = "", e = 32 * n.length;
            for (t = 0; t < e; t += 8)
                r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
            return r
        }
        function h(n) {
            var t, r = [];
            for (r[(n.length >> 2) - 1] = void 0,
            t = 0; t < r.length; t += 1)
                r[t] = 0;
            var e = 8 * n.length;
            for (t = 0; t < e; t += 8)
                r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32;
            return r
        }
        function e(n) {
            var t, r, e = "0123456789abcdef", o = "";
            for (r = 0; r < n.length; r += 1)
                t = n.charCodeAt(r),
                o += e.charAt(t >>> 4 & 15) + e.charAt(15 & t);
            return o
        }
        function r(n) {
            return unescape(encodeURIComponent(n))
        }
        function o(n) {
            return function(n) {
                return a(i(h(n), 8 * n.length))
            }(r(n))
        }
        function u(n, t) {
            return function(n, t) {
                var r, e, o = h(n), u = [], c = [];
                for (u[15] = c[15] = void 0,
                16 < o.length && (o = i(o, 8 * n.length)),
                r = 0; r < 16; r += 1)
                    u[r] = 909522486 ^ o[r],
                    c[r] = 1549556828 ^ o[r];
                return e = i(u.concat(h(t)), 512 + 8 * t.length),
                a(i(c.concat(e), 640))
            }(r(n), r(t))
        }
        function t(n, t, r) {
            return t ? r ? u(t, n) : function(n, t) {
                return e(u(n, t))
            }(t, n) : r ? o(n) : function(n) {
                return e(o(n))
            }(n)
        }
        "function" == typeof define && define.amd ? define(function() {
            return t
        }) : "object" == typeof module && module.exports ? module.exports = t : n.md5 = t
    }(this);
    function load3rdScripts() {
        !function() {
            function t() {
                s = !0,
                this.removeEventListener("DOMAttrModified", t, !1)
            }
            function e(t) {
                return t.replace(o, function(t, e) {
                    return e.toUpperCase()
                })
            }
            function n() {
                var t = {};
                return r.call(this.attributes, function(n) {
                    (i = n.name.match(d)) && (t[e(i[1])] = n.value)
                }),
                t
            }
            function a(t, e, n) {
                Object.defineProperty ? Object.defineProperty(t, e, {
                    get: n
                }) : t.__defineGetter__(e, n)
            }
            var i, r = [].forEach, d = /^data-(.+)/, o = /\-([a-z])/gi, c = document.createElement("div"), s = !1;
            void 0 == c.dataset && (c.addEventListener("DOMAttrModified", t, !1),
            c.setAttribute("foo", "bar"),
            a(Element.prototype, "dataset", s ? function() {
                return this._datasetCache || (this._datasetCache = n.call(this)),
                this._datasetCache
            }
            : n),
            document.addEventListener("DOMAttrModified", function(t) {
                delete t.target._datasetCache
            }, !1))
        }()
    }
    if (!parseInt(validMedia, 10))
        return;
    load3rdScripts();
    if (USE_CRITEO_DIRECT_BIDDER)
        __.loadCriteo();
    isChrome = __.isChrome();
    var protocol = isChrome ? "https:" : "";
    BASE_URL = protocol + BASE_URL;
    SSPAPI = protocol + SSPAPI;
    SSPFILLERAPI = protocol + SSPFILLERAPI;
    gLogFrame = __.createAndGetBeaconFrame();
    var notFoundNode = d.getElementById(TAXEL_ARTICLE_NOT_EXISTS_ID);
    if (notFoundNode != null)
        __.createNotFoundBeacon();
    var articleIdRes = __.taxel_link_completion(__.taxel_url_replace(urlReplaceRules, __.getArticleIdResource()));
    var requestId = __.getCookieValue(REQUEST_ID_COOKIE_NAME);
    GMOADRW.removeReqIdCookie();
    var cookieId = __.getCookieValue(FIRST_COOKIE_ID_COOKIE_NAME);
    if (cookieId == "" || !/^\d{2}/.test(cookieId)) {
        cookieId = __.createCookieId();
        __.setCookieValue(FIRST_COOKIE_ID_COOKIE_NAME, cookieId, FIRST_COOKIE_ID_EXPIRE_SECOND)
    } else
        __.setCookieValue(FIRST_COOKIE_ID_COOKIE_NAME, cookieId, FIRST_COOKIE_ID_EXPIRE_SECOND);
    var Ids = __.getWidgetIds();
    var displayedIds = [];
    var displayCnt = 0;
    var isAmp = "";
    var isDokuryoRecommend = "";
    for (var i = 0; i < Ids.length; i++) {
        if (widgetIds.indexOf(parseInt(Ids[i], 10)) === -1)
            continue;
        let userAgent = window.navigator.userAgent;
        let spDeviceList = ["iPhone", "Android", "iPad"];
        let userSpDevice = spDeviceList.find(device=>userAgent.indexOf(device) > 0);
        let deviceWidgetIds = userSpDevice ? SP_WIDGET_IDS : PC_WIDGET_IDS;
        if (deviceWidgetIds.indexOf(parseInt(Ids[i], 10)) === -1)
            continue;
        var insNode = __.getLastWidgetNodeById("gmo_rw_" + Ids[i]);
        if (insNode != null) {
            if (insNode.dataset["page"] === "amp")
                isAmp = "1";
            if (insNode.dataset["gmodr"] === "true")
                isDokuryoRecommend = true
        }
        if (insNode && insNode.style.display !== "none") {
            displayedIds.push(Ids[i]);
            displayCnt++
        }
    }
    window.addEventListener("message", function(e) {
        if (GMOADRW.getHostName(e.origin) != COOKIE_SYNC_GMOSSP_TO_DSP_DOMAIN)
            return;
        receivedTopicsMessage = true;
        try {
            if (e.data && e.data.length === 0)
                return;
            let num = 0;
            e.data.forEach(function(d) {
                if (d.tpv && d.tp) {
                    topics += "\x26tpv[" + num + "]\x3d" + d.tpv + "\x26tp[" + num + "]\x3d" + d.tp;
                    num++
                }
            })
        } catch (e) {}
    });
    GMOADRW.cookieSyncGMOSSPToDSP();
    if (displayCnt === 0)
        __.sendDummyRequest();
    else if (__.canNearInviewLoadWidget(displayedIds))
        window.addEventListener("scroll", function nearInviewLoad() {
            var inviewBottomPos = window.screen.height + window.top.pageYOffset;
            var inviewTopPos = window.top.pageYOffset;
            var widgets = document.querySelectorAll("[id*\x3dgmo_rw_], [data-gmoad\x3drw]");
            var widgetTopTagPos = widgets[0].getBoundingClientRect().top + window.pageYOffset;
            var widgetBottomTagPos = widgets[widgets.length - 1].getBoundingClientRect().top + window.pageYOffset;
            if (inviewBottomPos > widgetTopTagPos && inviewTopPos < widgetBottomTagPos) {
                __.createWidgetScript(displayedIds);
                this.removeEventListener("scroll", nearInviewLoad)
            }
        });
    else
        __.createWidgetScript(displayedIds)
}
)(document);
