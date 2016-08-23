﻿using System;
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
    public class UserCardsController : Controller
    {
        private TestEntities db = new TestEntities();

        // GET: UserCardMaps/getall
        public JsonResult GetAll(int? page, string search)
        {
            List<UserCardMap> userCards;
            if (!string.IsNullOrEmpty(search))
            {
                userCards =
                    db.UserCardMaps.Where(u =>
                            u.CardInfo.IdNumber == search || u.AspNetUser.FullName == search ||
                            u.AspNetUser.Email == search)
                    .ToList();
            }
            else
            {
                userCards =
                    db.UserCardMaps.ToList();
            }
            var pager = new Pager(userCards.Count, page);
            var viewModel = new ViewModel<UserCardMap>
            {
                Items = userCards.Select(uc=> new UserCardMap
                {
                    Id   = uc.Id,
                    Notes = uc.Notes,
                    StatusId = uc.StatusId,
                    UserId = uc.UserId,
                    CardId = uc.CardId,
                    Status = new Status
                    {
                        Id = uc.Status.Id,
                        Type = uc.Status.Type
                    },
                    AspNetUser = new AspNetUser
                    {
                        Id = uc.AspNetUser.Id,
                        FullName = uc.AspNetUser.FullName,
                        Email = uc.AspNetUser.Email
                    },
                    CardInfo = new CardInfo
                    {
                        Id = uc.CardInfo.Id,
                        IdNumber = uc.CardInfo.IdNumber
                    },
                    UserEmail = uc.AspNetUser.Email,
                    CardIdNumber = uc.CardInfo.IdNumber
                }).Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize),
                Pager = pager
            };
            return Json(viewModel, JsonRequestBehavior.AllowGet);
        }


        // POST: UserCardMaps/Create
        [HttpPost]
        public JsonResult Create(UserCardMap userCardMap)
        {
            DateTime nowTime = DateTime.Now;
            DateTime maxTime = DateTime.MaxValue;
            userCardMap.IssueDate = nowTime;
            userCardMap.RevocationDate = maxTime;

            var card = db.CardInfoes.FirstOrDefault(c => c.IdNumber.Equals(userCardMap.CardIdNumber));
            var user = db.AspNetUsers.FirstOrDefault(u => u.Email.Equals(userCardMap.UserEmail));

            var doubleCard = db.UserCardMaps.FirstOrDefault(uc => uc.CardId == card.Id);
            if (doubleCard != null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Card already assigned");
            }
            if (card == null || user == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Invalid Model State");
            }

            var userCard= new UserCardMap
            {
                UserId = user.Id, 
                CardId = card.Id,
                StatusId = userCardMap.StatusId,
                IssueDate = nowTime,
                RevocationDate = maxTime
            };
            db.UserCardMaps.Add(userCard);
            db.SaveChanges();
            db.Configuration.LazyLoadingEnabled = false;
            db.Configuration.ProxyCreationEnabled = false;
            var dbUserCard = db.UserCardMaps.Find(userCard.Id);
            return Json(dbUserCard);
        }

        // POST: UserCardMaps/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public JsonResult Edit(UserCardMap userCardMap)
        {
            var dbUserCard = db.UserCardMaps.Find(userCardMap.Id);

            var card = db.CardInfoes.FirstOrDefault(c => c.IdNumber.Equals(userCardMap.CardIdNumber));
            var user = db.AspNetUsers.FirstOrDefault(u => u.Email.Equals(userCardMap.UserEmail));
            if (card == null || user == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Invalid Model State");
            }

            dbUserCard.CardId = card.Id;
            dbUserCard.UserId = user.Id;
            dbUserCard.StatusId = userCardMap.StatusId;

            db.SaveChanges();
            return Json(userCardMap);
        }

        // POST: UserCardMaps/Delete/5
        [HttpPost]
        public ActionResult Delete(int id)
        {
            UserCardMap userCardMap = db.UserCardMaps.Find(id);
            if (userCardMap == null)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { jobId = -1 });
            }
            db.UserCardMaps.Remove(userCardMap);
            db.SaveChanges();
            return Json("");
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
