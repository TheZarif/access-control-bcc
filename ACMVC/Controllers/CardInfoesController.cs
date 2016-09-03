using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ACMVC.DAL;
using ACMVC.Models;
using ACMVC.Models.ViewModels;

namespace ACMVC.Controllers
{
    public class CardInfoesController : Controller
    {
        private TestEntities db = new TestEntities();

        public JsonResult GetAll(int? page, string search, int? statusId)
        {
            List<CardInfo> cardInfoes = string.IsNullOrEmpty(search) ? db.CardInfoes.Include(c => c.Status).ToList() : db.CardInfoes.Where(p => (p.Number.Contains(search))).ToList();

            if (statusId != null)
            {
                cardInfoes = cardInfoes.Where(p => p.StatusId == statusId).ToList();
            }

            var pager = new Pager(cardInfoes.Count(), page);

            var viewModel = new CardViewModel()
            {
                Cards = cardInfoes.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize).Select(x => new CardInfo()
                {
                    Id = x.Id,
                    Number = x.Number,
                    IdNumber = x.IdNumber,
                    Notes = x.Notes,
                    StatusId = x.StatusId,
                    Status = new Status()
                    {
                        Id = x.Status.Id,
                        Type = x.Status.Type,
                        Description = x.Status.Description
                    }
                }).ToList(),
                Pager = pager
            };

            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }

        // GET: CardInfoes/Details/5
        public JsonResult Details(int? id)
        {
            if (id == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            CardInfo card = db.CardInfoes.Find(id);
            if (card == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Could not find object", JsonRequestBehavior.AllowGet);
            }
            return Json(new CardInfo
            {
                Id = card.Id,
                Number = card.Number,
                Notes = card.Notes,
                IdNumber = card.IdNumber,
                Status = new Status { Id = card.Status.Id, Type = card.Status.Type, Description = card.Status.Description }
            }, 
            JsonRequestBehavior.AllowGet);

        }

        // POST: CardInfoes/Create       
        [HttpPost]
        public JsonResult Create(CardInfo cardInfo)
        {
            if (ModelState.IsValid)
            {
                db.CardInfoes.Add(cardInfo);
                db.SaveChanges();

                db.Configuration.LazyLoadingEnabled = false;
                db.Configuration.ProxyCreationEnabled = false;

                var dbCard = db.CardInfoes.Find(cardInfo.Id);
                return Json(dbCard);
            }

            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }

       
        // POST: CardInfoes/Edit/5
        [HttpPost]
        public JsonResult Edit(CardInfo cardInfo)
        {
            if (ModelState.IsValid)
            {
                if (cardInfo.StatusId == 2)
                {
                    MakeDisabled(cardInfo);
                }

                var dbCard = db.CardInfoes.Find(cardInfo.Id);
                dbCard.StatusId = cardInfo.StatusId;
                dbCard.IdNumber = cardInfo.IdNumber;
                dbCard.Number = cardInfo.Number;
                dbCard.Notes = cardInfo.Notes;

                db.SaveChanges();
                db.Configuration.LazyLoadingEnabled = false;
                return Json(cardInfo);
            }
            Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return Json("Invalid Model State");
        }
        
        // POST: CardInfoes/Delete/5
        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            CardInfo cardInfo = db.CardInfoes.Find(id);
            if (cardInfo == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.CardInfoes.Remove(cardInfo);
            db.SaveChanges();
            return Json("");
        }

        [HttpGet]
        public JsonResult GetAutoComplete(string idNumber)
        {
            db.Configuration.LazyLoadingEnabled = false;
            return Json(db.CardInfoes.Where(c => c.IdNumber.Contains(idNumber)).Take(7).ToList(), JsonRequestBehavior.AllowGet);
        }

        public void MakeActive(CardInfo card)
        {
            card.StatusId = 1;
        }

        public void MakeDisabled(CardInfo card)
        {
            var userCards = db.UserCardMaps.Where(uc => uc.CardId == card.Id);
            foreach (var userCard in userCards)
            {
                userCard.StatusId = 1003;
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
